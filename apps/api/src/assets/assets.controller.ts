import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AssetsService } from './assets.service';
import { ListAssetsQueryDto } from './dto/list-assets-query.dto';
import { PaginatedPublicAssetsDto } from './dto/public-asset.dto';

@ApiTags('assets')
@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get()
  @ApiOperation({ summary: 'List published assets (public catalog)' })
  @ApiOkResponse({ type: PaginatedPublicAssetsDto })
  async list(@Query() query: ListAssetsQueryDto): Promise<PaginatedPublicAssetsDto> {
    const page = query.page != null && query.page >= 1 ? query.page : 1;
    const limit =
      query.limit != null && query.limit >= 1 && query.limit <= 100 ? query.limit : 20;
    return this.assetsService.listPublished(page, limit);
  }
}
