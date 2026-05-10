import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { Subject, filter, takeUntil, interval } from 'rxjs';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { StatsCard } from '../../components/stats-card/stats-card';
import { DailyChart } from '../../components/daily-chart/daily-chart';
import { CategoryChart } from '../../components/category-chart/category-chart';
import { MonthlyChart } from '../../components/monthly-chart/monthly-chart';
import { DeviceList } from '../../../../device-management/presentation/components/device-list/device-list';
import { Device } from '../../../../device-management/domain/model/device.entity';
import { DailyConsumption } from '../../../domain/model/entities/daily-consumption.entity';
import { ConsumptionByCategory } from '../../../domain/model/entities/consumption-by-category.entity';
import { MonthlyComparison } from '../../../domain/model/entities/monthly-comparison.entity';
import { DashboardStats } from '../../../domain/model/entities/dashboard-stats.entity';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DashboardService } from '../../../application/services/dashboard.service';
import { AuthService } from '../../../../iam/application/services/auth.service';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    TranslateModule,
    StatsCard,
    DailyChart,
    CategoryChart,
    MonthlyChart,
    DeviceList,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit, OnDestroy {
  dashboardStats: DashboardStats = new DashboardStats(0, 0, 0, 0, 0, 'S/.');
  dailyConsumption?: DailyConsumption;
  consumptionByCategory?: ConsumptionByCategory;
  monthlyComparison?: MonthlyComparison;
  devices: Device[] = [];
  alerts: any[] = [];
  isLoading = false;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private translate: TranslateService,
    private dashboardService: DashboardService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.dashboardStats.currency = this.translate.instant('dashboard.units.currency');
    this.cdr.detectChanges();

    this.loadDashboardData();

    interval(30000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadBackendData();
      });

    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe(evt => {
      if (evt.urlAfterRedirects === '/home' || evt.url === '/home') {
        this.loadDashboardData();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadDashboardData(): void {
    this.isLoading = true;

    this.authService.authState$.pipe(takeUntil(this.destroy$)).subscribe(authState => {
      if (authState.isLoading) {
        return;
      }

      if (!authState.isAuthenticated || !authState.user) {
        this.router.navigate(['/login']);
        return;
      }

      this.loadBackendData();
    });
  }

  private updateChartData(): void {
    if (!this.devices || this.devices.length === 0) {
      return;
    }

    setTimeout(() => {
      this.cdr.detectChanges();
    }, 100);
  }

  private loadBackendData(): void {
    this.isLoading = true;

    this.dashboardService.loadUnifiedDashboard().subscribe({
      next: (data) => {
        if (data.alerts) {
          this.alerts = data.alerts;
        }

        this.dashboardService.getDashboardState().pipe(takeUntil(this.destroy$)).subscribe(state => {
          if (state.stats) {
            this.dashboardStats = state.stats;
          }

          if (state.dailyConsumption) {
            this.dailyConsumption = state.dailyConsumption;
          }

          if (state.consumptionByCategory) {
            this.consumptionByCategory = state.consumptionByCategory;
          }

          if (state.devices) {
            this.devices = state.devices || [];
            this.updateChartData();
          }

          this.isLoading = false;
          this.cdr.detectChanges();
        });
      },
      error: () => {
        this.dashboardStats = new DashboardStats(0, 0, 0, 0, 0, 'S/.');
        this.devices = [];
        this.alerts = [];

        setTimeout(() => {
          this.isLoading = false;
          this.cdr.detectChanges();
        }, 50);
      }
    });
  }

  getCalculatedEnergyConsumption(): string {
    const unit = this.translate.instant('dashboard.units.kwh');
    return `${this.dashboardStats.energyConsumption.toFixed(1)} ${unit}`;
  }

  getCalculatedTodayConsumption(): string {
    const unit = this.translate.instant('dashboard.units.kwh');
    return `${this.dashboardStats.todayConsumption.toFixed(2)} ${unit}`;
  }

  getCalculatedEstimatedBill(): string {
    const currency = this.translate.instant('dashboard.units.currency');
    return `${currency} ${this.dashboardStats.estimatedBill.toFixed(2)}`;
  }

  getCalculatedActiveDevices(): string {
    const totalDevicesCount = this.devices.length || this.dashboardStats.activeDevices;
    return `${this.dashboardStats.activeDevices} ${this.translate.instant('dashboard.stats.active')} / ${totalDevicesCount} ${this.devicesLabel}`;
  }

  getCalculatedSavings(): string {
    const percentSymbol = this.translate.instant('dashboard.units.percentage');
    const savingsValue = this.dashboardStats.estimatedSavings;

    if (savingsValue < 0) {
      return `${Math.abs(savingsValue)}${percentSymbol} ${this.translate.instant('dashboard.stats.extraConsumption')}`;
    }

    if (savingsValue === 0) {
      return this.translate.instant('dashboard.stats.noSavings');
    }

    return `${savingsValue}${percentSymbol} ${this.translate.instant('dashboard.stats.saved')}`;
  }

  get hasDevices(): boolean {
    return this.devices && this.devices.length > 0;
  }

  get hasConsumptionData(): boolean {
    return this.dailyConsumption?.dataPoints ? this.dailyConsumption.dataPoints.length > 0 : false;
  }

  get hasCategoryData(): boolean {
    return this.consumptionByCategory?.categories ? this.consumptionByCategory.categories.length > 0 : false;
  }

  get hasMonthlyData(): boolean {
    // Always show monthly chart with static data
    return true;
  }


  get energyConsumptionLabel(): string {
    return this.translate.instant('dashboard.stats.energyConsumption');
  }

  get monthlySavingGoalLabel(): string {
    return this.translate.instant('dashboard.stats.monthlySavingGoal');
  }

  get estimatedSavingsLabel(): string {
    return this.translate.instant('dashboard.stats.estimatedSavings');
  }

  get consumptionLabel(): string {
    return this.translate.instant('dashboard.stats.consumption');
  }

  get activeDevicesLabel(): string {
    return this.translate.instant('dashboard.stats.activeDevices');
  }

  get devicesLabel(): string {
    return this.translate.instant('dashboard.stats.devices');
  }

  get estimatedBillLabel(): string {
    return this.translate.instant('dashboard.stats.estimatedBill');
  }

  get todayConsumptionLabel(): string {
    return this.translate.instant('dashboard.stats.todayConsumption');
  }

  get alertsTitleLabel(): string {
    return this.translate.instant('dashboard.alerts.title');
  }

  get highConsumptionLabel(): string {
    return this.translate.instant('dashboard.alerts.highConsumption');
  }

  get highConsumptionMessageLabel(): string {
    return this.translate.instant('dashboard.alerts.highConsumptionMessage');
  }

  get reminderLabel(): string {
    return this.translate.instant('dashboard.alerts.reminder');
  }

  get reminderMessageLabel(): string {
    return this.translate.instant('dashboard.alerts.reminderMessage');
  }

  getTranslation(key: string): string {
    return this.translate.instant(key);
  }
}
