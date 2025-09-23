# Titan Mail (GoDaddy) Email Setup Guide

This guide explains how to configure the email system to use Titan Mail from GoDaddy with your contact@affordindia.com email address.

## Configuration Overview

The system has been configured to use Titan Mail's SMTP servers for sending emails. This includes:

-   Contact form submissions
-   Admin notifications
-   User auto-replies

## SMTP Settings for Titan Mail

The application uses the following SMTP configuration for Titan Mail:

```
Host: smtpout.secureserver.net
Port: 587
Security: STARTTLS (not SSL)
Authentication: Required
```

## Environment Variables

Update your `.env` file with the following settings:

```env
# Email Configuration - Titan Mail (GoDaddy)
EMAIL_SERVICE=custom
EMAIL_HOST=smtpout.secureserver.net
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=contact@affordindia.com
EMAIL_PASS=your_titan_mail_password
EMAIL_FROM_NAME=Afford India
EMAIL_FROM_ADDRESS=contact@affordindia.com
EMAIL_SUPPORT=contact@affordindia.com
EMAIL_ADMIN=contact@affordindia.com
```

## Required Steps

### 1. Set Email Password

Replace `your_titan_mail_password` in the `.env` file with the actual password for your contact@affordindia.com Titan Mail account.

**Important:** Use the email account password, not an app-specific password (Titan Mail doesn't use app passwords like Gmail).

### 2. Verify Email Account

Ensure that:

-   The contact@affordindia.com email account is active in your GoDaddy Titan Mail
-   You can log in to the account via webmail
-   SMTP access is enabled (it should be by default)

### 3. Test Configuration

After updating the password, restart your server and test the contact form to ensure emails are being sent successfully.

## Alternative Ports (if needed)

If port 587 doesn't work, you can try these alternatives:

### Port 25 (Standard SMTP)

```env
EMAIL_PORT=25
EMAIL_SECURE=false
```

### Port 465 (SSL)

```env
EMAIL_PORT=465
EMAIL_SECURE=true
```

### Port 3535 (Alternative)

```env
EMAIL_PORT=3535
EMAIL_SECURE=false
```

## Troubleshooting

### Common Issues

1. **Authentication Failed**

    - Verify the email address and password are correct
    - Ensure the email account is active in GoDaddy
    - Try logging into the webmail interface first

2. **Connection Timeout**

    - Check if your server's firewall allows outbound connections on port 587
    - Try alternative ports (25, 465, 3535)

3. **SSL/TLS Errors**
    - Ensure `EMAIL_SECURE=false` for port 587
    - Use `EMAIL_SECURE=true` only for port 465

### Testing Email Configuration

The application will automatically verify the email configuration on startup. Check the console logs for:

```
✅ Email configuration is valid
```

If you see an error, check your credentials and SMTP settings.

## Security Notes

-   Never commit your actual email password to version control
-   Use environment variables for all sensitive information
-   Consider using environment-specific .env files for different deployments

## Support

If you continue to have issues:

1. Verify your Titan Mail account is working via webmail
2. Contact GoDaddy support for SMTP access issues
3. Check server firewall settings for outbound email ports

## Migration from Gmail

The system has been updated from Gmail to Titan Mail. The key changes:

1. **Service Provider:** Changed from `gmail` to `custom`
2. **SMTP Host:** Changed to `smtpout.secureserver.net`
3. **Authentication:** Using regular password instead of app password
4. **Email Addresses:** Updated to use contact@affordindia.com

All email templates and functionality remain the same, only the delivery method has changed.
