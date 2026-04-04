import { Controller, Post, Body } from '@nestjs/common';
import { ContactService } from './contact.service';

@Controller('contact')
export class ContactController {
  constructor(private contactService: ContactService) {}

  @Post()
  sendContact(@Body() body: any) {
    return this.contactService.sendContact(body);
  }
}