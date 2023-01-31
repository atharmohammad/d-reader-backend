import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { WalletEntity } from 'src/decorators/wallet.decorator';
import { RestAuthGuard } from 'src/guards/rest-auth.guard';
import { AuctionHouseService } from 'src/vendors/auction-house.service';
import { CandyMachineService } from 'src/vendors/candy-machine.service';
import { HeliusService } from 'src/vendors/helius.service';
import { Wallet } from '@prisma/client';
import { PublicKey } from '@solana/web3.js';
import { PrismaService } from 'nestjs-prisma';
import { MintOneParams } from './dto/mint-one-params.dto';

// @UseGuards(RestAuthGuard)
// @ApiBearerAuth('JWT-auth')
@ApiTags('Playground')
@Controller('playground')
export class PlaygroundController {
  constructor(
    private readonly candyMachineService: CandyMachineService,
    private readonly auctionHouseService: AuctionHouseService,
    private readonly heliusService: HeliusService,
    private readonly prisma: PrismaService,
  ) {}

  /* WORK IN PROGRESS - proof of concept endpoint */
  @Get('find-minted-nfts')
  async findMintedNfts(@Query() query: MintOneParams) {
    return await this.candyMachineService.findMintedNfts(
      query.candyMachineAddress,
    );
  }

  /* WORK IN PROGRESS - proof of concept endpoint */
  @Get('create-candy-machine')
  async createCandyMachine() {
    const comic = await this.prisma.comic.findFirst();
    const comicIssue = await this.prisma.comicIssue.findFirst();
    const creator = await this.prisma.creator.findFirst();
    return await this.candyMachineService.createComicIssueCM(
      comic,
      comicIssue,
      creator,
    );
  }

  /* WORK IN PROGRESS - proof of concept endpoint */
  @Get('mint-one')
  async mintOne(@Query() query: MintOneParams) {
    return await this.candyMachineService.mintOne(query.candyMachineAddress);
  }

  /** @deprecated proof of concept endpoint */
  @Get('/transactions/construct/mint-one')
  async constructMintOneTransaction(
    @WalletEntity() wallet: Wallet,
    @Query() query: MintOneParams,
  ) {
    const publicKey = new PublicKey(wallet.address);
    return await this.candyMachineService.constructMintOneTransaction(
      publicKey,
      query.candyMachineAddress,
    );
  }

  /* WORK IN PROGRESS - proof of concept endpoint */
  @Get('create-auction-house')
  async createAuctionHouse() {
    return await this.auctionHouseService.createAuctionHouse();
  }

  @Get('helius/webhooks/create')
  async createWebhook() {
    return await this.heliusService.createMagicEdenListingsWebhook();
  }

  @Get('helius/webhooks/get')
  async getWebhook() {
    return await this.heliusService.getMeListingsWebhook();
  }

  @Get('helius/webhooks/receive')
  async getReceiveUpdates(@Body() body) {
    console.log('GET request body: ', body);
  }

  @Post('helius/webhooks/receive')
  async receiveUpdates(@Body() body) {
    try {
      // console.log(body[0]);

      body[0].instructions.forEach((i) => {
        console.log(i);
      });
    } catch (e) {
      console.log(e);
    }
  }
}
