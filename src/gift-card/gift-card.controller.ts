import { Controller, Get, Post,Patch,Put, Delete, Param, Body, Query,  UseGuards , HttpStatus } from '@nestjs/common';
import { GiftCardService } from './gift-card.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Import the guard
import { GiftCard , CreateGiftCardDto ,UpdateGiftCardDto ,ActivationGiftCardDto} from './gift-card.entity';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/guards/roles.decorator';

@Controller('gift-cards')
export class GiftCardController {
    constructor(private readonly giftCardService: GiftCardService) {}

    @Post() // Endpoint to create new gift-card (admin exclusivelly)
    //   @UseGuards(JwtAuthGuard, RoleGuard) // Appliquer les guards d'authentification et de rôle
    //   @Roles('admin') // Spécifier que seul une categorie avec le rôle 'merchant' peut accéder à cette route
    async create(@Body() createGiftCardDto: CreateGiftCardDto) {
        return {
                statusCode: HttpStatus.OK,
                data: await  this.giftCardService.create(createGiftCardDto)// Appel à la méthode du service pour mettre à jour la categorie
            };
    }

    @Patch(':id') // Endpoint to create new gift-card (admin exclusivelly)
    //   @UseGuards(JwtAuthGuard, RoleGuard) // Appliquer les guards d'authentification et de rôle
    //   @Roles('admin') // Spécifier que seul une categorie avec le rôle 'merchant' peut accéder à cette route
    async update(@Param('id') id: number,@Body() updateGiftCardDto: UpdateGiftCardDto) {
        return {
                statusCode: HttpStatus.OK,
                data: await  this.giftCardService.update(id , updateGiftCardDto)// Appel à la méthode du service pour mettre à jour la categorie
            };
    }

    @Patch('activate/:id') // Endpoint to create new gift-card (admin exclusivelly)
    //   @UseGuards(JwtAuthGuard, RoleGuard) // Appliquer les guards d'authentification et de rôle
    //   @Roles('admin') // Spécifier que seul une categorie avec le rôle 'merchant' peut accéder à cette route
    async activate(@Param('id') id: number,@Body() updateGiftCardDto: ActivationGiftCardDto) {
        return {
                statusCode: HttpStatus.OK,
                data: await  this.giftCardService.activate(id , updateGiftCardDto)// Appel à la méthode du service pour mettre à jour la categorie
            };
    }
}
