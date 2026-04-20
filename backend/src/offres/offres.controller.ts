import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { OffreService } from './offres.service';

@Controller('offres')
export class OffreController {
  constructor(private readonly offreService: OffreService) {}

  @Post()
  create(@Body() data: any) {
    return this.offreService.create(data);
  }

  @Get()
  findAll() {
    
   return this.offreService.findAll();
     }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.offreService.findOne(Number(id));
  }

  @Patch(':id')   // ✅ corrigé : Put → Patch
  update(@Param('id') id: string, @Body() data: any) {
    return this.offreService.update(Number(id), data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.offreService.delete(Number(id));
  }
}