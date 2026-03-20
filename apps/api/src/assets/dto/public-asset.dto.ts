import { ApiProperty } from '@nestjs/swagger';

export class PublicAssetDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  slug!: string;

  @ApiProperty()
  title!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty()
  priceCents!: number;

  @ApiProperty()
  currency!: string;

  @ApiProperty()
  previewReady!: boolean;

  @ApiProperty()
  createdAt!: string;
}

export class PaginatedPublicAssetsDto {
  @ApiProperty({ type: PublicAssetDto, isArray: true })
  items!: PublicAssetDto[];

  @ApiProperty()
  page!: number;

  @ApiProperty()
  limit!: number;

  @ApiProperty()
  total!: number;
}
