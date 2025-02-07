const fs = require("fs");
const dns = require("dns");
const csv = require("csv-parser");
const nodemailer = require("nodemailer");

const TOUCH_EMAIL = "partnerships@touch-csb.com";
const PERSONAL_EMAIL = "taraschuiko@gmail.com";
const NAME = "Taras Chuiko";

const getRandomHtmlTemplate = (placeName, placeAddress) => {
  const templates = [
    `<p>Szanowni Państwo,</p>
    <p>Nazywam się <strong>${NAME}</strong> i reprezentuję firmę Touch CSB. Chciałbym zapytać o możliwość wynajęcia <strong>1m²</strong> powierzchni dla naszej innowacyjnej kawiarni w miejscu <strong>${placeName}</strong> przy adresie <strong>${placeAddress}</strong>.</p>
    <p>Nasza kawiarnia to kompaktowe rozwiązanie, które zajmuje minimalną przestrzeń, a jednocześnie:</p>
    <ul>
        <li>Generuje dodatkowy przychód z wynajmu bez konieczności angażowania zasobów.</li>
        <li>Przyciąga nowych klientów i zwiększa komfort dotychczasowych odwiedzających.</li>
        <li>Nie wymaga dodatkowej infrastruktury – wystarczy standardowe gniazdko 220V.</li>
        <li>Oferuje atrakcyjne promocje dla Państwa pracowników i klientów.</li>
    </ul>
    <p>Całą obsługę i serwis urządzenia bierzemy na siebie, zapewniając jego bezproblemowe funkcjonowanie.</p>
    <p>W załączniku przesyłam prezentację z dodatkowymi szczegółami.</p>
    <p>Czy moglibyśmy omówić szczegóły współpracy? Chętnie odpowiem na wszelkie pytania.</p>`,

    `<p>Szanowni Państwo,</p>
    <p>Nazywam się <strong>${NAME}</strong> i kontaktuję się w sprawie potencjalnej współpracy. Reprezentuję firmę Touch CSB, a naszym flagowym produktem jest nowoczesna, w pełni zautomatyzowana kawiarnia, która zajmuje tylko <strong>1m²</strong> powierzchni.</p>
    <p>Chciałbym zapytać o możliwość wynajęcia takiej przestrzeni w <strong>${placeName}</strong> przy adresie <strong>${placeAddress}</strong>. Nasze rozwiązanie przynosi konkretne korzyści:</p>
    <ul>
        <li>Zwiększa atrakcyjność lokalizacji, oferując klientom wygodny dostęp do wysokiej jakości kawy.</li>
        <li>Generuje dodatkowy dochód z wynajmu powierzchni bez dodatkowych kosztów.</li>
        <li>Jest całkowicie bezobsługowe – my zajmujemy się serwisem i utrzymaniem.</li>
        <li>Nie wymaga dostępu do wody ani skomplikowanych instalacji – wystarczy standardowe gniazdko 220V.</li>
        <li>Może być dodatkowym atutem marketingowym, zwiększając ruch klientów.</li>
    </ul>
    <p>W załączniku przesyłam prezentację z dodatkowymi informacjami.</p>
    <p>Czy moglibyśmy umówić się na rozmowę w celu omówienia szczegółów?</p>`,

    `<p>Dzień dobry,</p>
    <p>Mam na imię <strong>${NAME}</strong> i reprezentuję Touch CSB – firmę, która oferuje innowacyjne rozwiązania w branży kawowej. Chciałbym zapytać, czy w Państwa placówce <strong>${placeName}</strong> przy adresie <strong>${placeAddress}</strong> byłaby możliwość wynajęcia niewielkiej przestrzeni – dokładnie <strong>1m²</strong> – na naszą kompaktową kawiarnię?</p>
    <p>Nasze urządzenie to nowoczesny, bezobsługowy automat, który:</p>
    <ul>
        <li>Zajmuje minimalną przestrzeń, ale generuje wartość dla klientów i właściciela obiektu.</li>
        <li>Oferuje wysokiej jakości kawę, podnosząc standard obsługi odwiedzających.</li>
        <li>Nie wymaga angażowania personelu – serwis i utrzymanie są po naszej stronie.</li>
        <li>Stanowi dodatkowe źródło dochodu bez żadnych inwestycji ze strony właściciela.</li>
    </ul>
    <p>Wierzę, że nasze rozwiązanie może pozytywnie wpłynąć na atrakcyjność Państwa placówki.</p>
    <p>Załączam szczegółową prezentację i chętnie odpowiem na pytania.</p>`,

    `<p>Szanowni Państwo,</p>
    <p>Nazywam się <strong>${NAME}</strong> i reprezentuję firmę Touch CSB, która specjalizuje się w innowacyjnych rozwiązaniach dla branży gastronomicznej.</p>
    <p>Zwracam się do Państwa z zapytaniem o możliwość wynajęcia <strong>1m²</strong> powierzchni w <strong>${placeName}</strong> przy adresie <strong>${placeAddress}</strong> w celu umieszczenia naszego nowoczesnego punktu kawowego.</p>
    <p>Nasza kawiarnia to innowacyjne, w pełni autonomiczne rozwiązanie, które:</p>
    <ul>
        <li>Zwiększa komfort klientów, oferując im wysokiej jakości kawę bez kolejek.</li>
        <li>Generuje dodatkowy przychód z wynajmu niewielkiej powierzchni.</li>
        <li>Nie wymaga żadnej obsługi ze strony Państwa zespołu.</li>
        <li>Może być elementem promocji obiektu – oferujemy rabaty dla pracowników.</li>
    </ul>
    <p>W załączniku znajdą Państwo prezentację, która lepiej obrazuje naszą propozycję.</p>
    <p>Czy moglibyśmy umówić się na rozmowę?</p>`,

    `<p>Dzień dobry,</p>
    <p>Chciałbym zapytać, czy w Państwa placówce <strong>${placeName}</strong> przy adresie <strong>${placeAddress}</strong> istnieje możliwość wynajęcia niewielkiej przestrzeni – dokładnie <strong>1m²</strong> – pod naszą innowacyjną kawiarnię?</p>
    <p>To w pełni zautomatyzowane rozwiązanie, które:</p>
    <ul>
        <li>Oferuje szybki dostęp do świeżej kawy, co zwiększa satysfakcję klientów.</li>
        <li>Generuje dodatkowy ruch klientów i przychód z wynajmu.</li>
        <li>Wymaga jedynie dostępu do prądu (220V) i nie obciąża Państwa zespołu.</li>
        <li>Może być dodatkowym atutem w promocji lokalizacji.</li>
    </ul>
    <p>W załączniku przesyłam prezentację z dodatkowymi informacjami.</p>
    <p>Proszę o kontakt, jeśli byłaby możliwość omówienia szczegółów.</p>`,
  ];

  const signature = `
  <p>Z poważaniem,<br>${NAME}</p>
  <hr>
  <img src="https://i.postimg.cc/wMbkRZf3/touch-logo.jpg" width="200" alt="Touch CSB">`;

  return `<div>
    ${templates[Math.floor(Math.random() * templates.length)]}
    ${signature}
    </div>`;
};

async function checkEmail(email) {
  const domain = email.split("@")[1];

  return new Promise((resolve) => {
    dns.resolveMx(domain, (err, addresses) => {
      if (err || addresses.length === 0) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    // Touch CSB Gmail credentials
    user: TOUCH_EMAIL,
    pass: process.env.TOUCH_EMAIL_PASS,

    // Taras's Gmail credentials
    // user: PERSONAL_EMAIL,
    // pass: process.env.PERSONAL_EMAIL_PASS,
  },
});

const places = [];
fs.createReadStream("places.csv")
  .pipe(
    csv({
      separator: ";",
    })
  )
  .on("data", (row) => {
    if (row.email) {
      places.push(row);
    }
  })
  .on("end", async () => {
    console.log(
      `Found ${places.length} recipients. Sending emails with delays...`
    );
    await sendEmails();
  });

async function sendEmails() {
  for (let index = 0; index < places.length; index++) {
    const place = places[index];

    if (!place.email) {
      console.error(`No email found for ${place.name}. Skipping...`);
      continue;
    }

    const doesMxRecordExist = await checkEmail(place.email);

    if (!doesMxRecordExist) {
      console.error(
        `MX record does not exist for ${place.email} (${place.name}). Skipping...`
      );
      continue;
    }

    const mailOptions = {
      from: `Touch | Taras Chuiko <${TOUCH_EMAIL}>`,
      to: place.email,
      bcc: PERSONAL_EMAIL,
      subject: `Zapytanie o możliwość wynajmu miejsca – ${place.name}`,
      html: getRandomHtmlTemplate(place.name, place.address),
      attachments: [
        {
          filename: "Prezentacja Touch.pdf",
          content: fs.createReadStream("Prezentacja Touch.pdf"),
        },
      ],
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Email sent to: ${place.email} (${place.name})`);
    } catch (error) {
      console.error(
        `Failed to send email to ${place.email} (${place.name}):`,
        error.message
      );
    }

    if (index < places.length - 1) {
      const delay = Math.floor(Math.random() * 60000);
      console.log(
        `Waiting ${delay / 1000} seconds before sending the next email...`
      );

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  console.log("All emails sent.");
}
