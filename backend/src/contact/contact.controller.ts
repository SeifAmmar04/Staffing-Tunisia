import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { ContactService } from './contact.service';

@Controller('contact')
export class ContactController {
  constructor(private contactService: ContactService) {}
  @Get()
  findAll() {
    return this.contactService.findAll();
  }
 
  // DELETE /contact/:id
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.contactService.delete(+id);
  }
  @Post()
  sendContact(@Body() body: any) {
    return this.contactService.sendContact(body);
  }
}