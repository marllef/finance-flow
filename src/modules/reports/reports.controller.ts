import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { DetailsFilterDTO, SummaryFilterDTO } from './dto/filter.dto';
import { plainToInstance } from 'class-transformer';
import { DetailsReportDTO } from './dto/details-report.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRoles } from '@prisma/client';
import { SummaryReportDTO } from './dto/summary-report.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Roles(UserRoles.ADMIN)
  @Get('summary')
  async summaryReport(@Query() filter: SummaryFilterDTO) {
    const response = await this.reportsService.summary(filter);
    return plainToInstance(SummaryReportDTO, response)
  }

  @Roles(UserRoles.ADMIN)
  @Get('details')
  async detailsReport(@Query() filter: DetailsFilterDTO) {
    const response = await this.reportsService.details(filter);

    return plainToInstance(DetailsReportDTO, response);
  }
}
