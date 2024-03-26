import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { UserType } from 'src/users/dto/user';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  public sendEmail({ user }: { user: UserType }): void {
    this.mailerService
      .sendMail({
        to: user.email,
        from: 'noreply@payever.com',
        subject: 'Welcome to Payever',
        html: `<p>Congradulations on joining Payever, ${user.firstName} ${user.lastName}.</p>`,
      })
      .then(() => {
        console.log(`email sent to ${user.firstName} ${user.lastName}`);
      })
      .catch((error) => {
        console.log(
          `Email not sent to ${user.firstName} ${user.lastName} due to => ${error}`,
        );
      });
  }
}
