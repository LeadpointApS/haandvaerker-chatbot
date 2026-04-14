import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { settings, form, estimate, summaryLog } = body ?? {};

    if (!settings?.businessEmail) {
      return NextResponse.json({ error: 'Virksomhedens mail mangler i dashboardet.' }, { status: 400 });
    }

    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT ?? 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.SMTP_FROM ?? user;

    if (!host || !user || !pass || !from) {
      return NextResponse.json(
        { error: 'SMTP er ikke sat op. Tilføj SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS og SMTP_FROM i miljøvariabler.' },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass }
    });

    const lines = [
      `Ny VVS-forespørgsel fra ${form.name || 'Ukendt kunde'}`,
      '',
      `Virksomhed: ${settings.companyName}`,
      `Opgavetype: ${form.task || '-'}`,
      `Prisestimat: ${estimate?.manual ? 'Manuel vurdering' : `${estimate?.min} - ${estimate?.max} kr.`}`,
      `Kunde ønsker kontakt: ${form.wantContact || '-'}`,
      '',
      'Kundedata:',
      `Navn: ${form.name || '-'}`,
      `Telefon: ${form.phone || '-'}`,
      `Email: ${form.email || '-'}`,
      `Adresse: ${form.address || '-'}`,
      `Postnummer: ${form.zip || '-'}`,
      '',
      'Svarlog:'
    ];

    for (const entry of summaryLog ?? []) {
      lines.push(`- ${entry.question}: ${entry.answer}`);
    }

    if (Array.isArray(form.images) && form.images.length > 0) {
      lines.push('', `Billeder uploadet i browserdemo: ${form.images.length} stk.`, 'Bemærk: lokale browserbilleder vedhæftes ikke automatisk i denne prototype.');
    }

    await transporter.sendMail({
      from,
      to: settings.businessEmail,
      replyTo: form.email || undefined,
      subject: `Ny VVS-forespørgsel${form.task ? ` • ${form.task}` : ''}`,
      text: lines.join('\n')
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Kunne ikke sende mailen.' }, { status: 500 });
  }
}
