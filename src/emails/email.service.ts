import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { UserType } from '../users/dto/user';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly logger: Logger,
  ) {}

  public sendEmail({ user }: { user: UserType }): void {
    this.mailerService
      .sendMail({
        to: user.email,
        from: 'noreply@payever.com',
        subject: 'Welcome to Payever',
        html: `<p>Congradulations on joining Payever, ${user.firstName} ${user.lastName}.</p>`,
      })
      .then(() => {
        this.logger.log(`email sent to ${user.firstName} ${user.lastName}`);
      })
      .catch((error) => {
        this.logger.error(
          `Email not sent to ${user.firstName} ${user.lastName}`,
          { error: error },
        );
      });
  }
}
