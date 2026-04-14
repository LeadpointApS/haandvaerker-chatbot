import { EstimateResult, FormState, Settings } from './types';

export function money(n: number): string {
  return new Intl.NumberFormat('da-DK').format(Math.round(n)) + ' kr.';
}

export function estimateLeadScore(form: FormState, manual: boolean) {
  if (manual) return { label: 'Medium', reason: 'Kræver manuel vurdering' };
  const strong =
    form.acceptPrice === 'Ja' &&
    form.wantContact === 'Ja, kontakt mig' &&
    form.urgency &&
    form.urgency !== 'Fleksibel' &&
    form.name &&
    form.phone &&
    form.task &&
    form.zip;

  if (strong) return { label: 'Hot', reason: 'Klar til opfølgning og prisniveau accepteret' };
  if (form.wantContact === 'Ja, kontakt mig') return { label: 'Medium', reason: 'Relevant lead med kontaktønske' };
  return { label: 'Cold', reason: 'Kunden ønsker kun estimat eller mangler data' };
}

export function calculateEstimate(form: FormState, settings: Settings): EstimateResult {
  let min = 0;
  let max = 0;
  let manual = false;
  let included: string[] = [];
  const disclaimers = [
    'Estimatet er vejledende og baseret på kundens oplysninger.',
    'Ekstra tilpasning, materialer og uforudsete forhold kan påvirke den endelige pris.'
  ];

  switch (form.task) {
    case 'Toilet':
      if (form.toiletWork === 'Udskiftning') {
        if (form.toiletType === 'Væghængt' || form.installation === 'Nej, det er ny installation') {
          manual = true;
          break;
        }
        min = 3000;
        max = 4500;
        included = ['Standard montering', 'Udskiftning i eksisterende installation'];
        if (form.delivery === "VVS'er skal levere") {
          if (form.level === 'Premium') {
            min += 4500;
            max += 9000;
          } else if (form.level === 'Mellem') {
            min += 3500;
            max += 6000;
          } else {
            min += 2500;
            max += 4500;
          }
        }
        if (form.installation === 'Ja, men der skal måske tilpasses') {
          min += 800;
          max += 2500;
        }
      } else if (form.toiletWork === 'Reparation') {
        min = 1500;
        max = 3000;
        included = ['Fejlfinding', 'Mindre reparation hvis muligt'];
        disclaimers.push('Hvis toiletets indmad eller større dele skal udskiftes, kan prisen blive højere.');
      } else {
        manual = true;
      }
      break;

    case 'Armatur':
      min = form.armaturType === 'Håndvaskarmatur' ? 1500 : 1800;
      max = form.armaturType === 'Håndvaskarmatur' ? 2500 : 2800;
      included = ['Standard montering', 'Udskiftning i eksisterende installation'];
      if (form.armaturType === 'Begge dele') {
        min += 1400;
        max += 2600;
      }
      if (form.delivery === "VVS'er skal levere") {
        if (form.level === 'Premium') {
          min += 2500;
          max += 5000;
        } else if (form.level === 'Mellem') {
          min += 1700;
          max += 3200;
        } else {
          min += 1200;
          max += 2500;
        }
      }
      if (form.access === 'Trang / svært') {
        min += settings.difficultAccessMin;
        max += settings.difficultAccessMax;
      }
      if (form.access === 'Meget svært') {
        min += settings.difficultAccessMin + 400;
        max += settings.difficultAccessMax + 1000;
      }
      if (form.installation === 'Ja, men der skal måske tilpasses') {
        min += 600;
        max += 1800;
      }
      if (form.installation === 'Nej, det er ny installation') manual = true;
      break;

    case 'Bruser':
      min = form.bruserType === 'Brusersæt' ? 1200 : 1800;
      max = form.bruserType === 'Brusersæt' ? 2000 : 3000;
      included = ['Standard montering'];
      if (form.bruserType === 'Begge dele') {
        min += 1000;
        max += 2200;
      }
      if (form.delivery === "VVS'er skal levere") {
        if (form.level === 'Premium') {
          min += 1800;
          max += 3000;
        } else {
          min += 800;
          max += 2200;
        }
      }
      if (form.access === 'Trang / svært') {
        min += settings.difficultAccessMin - 100;
        max += settings.difficultAccessMax;
      }
      if (form.access === 'Meget svært') {
        min += settings.difficultAccessMin + 300;
        max += settings.difficultAccessMax + 900;
      }
      break;

    case 'Radiator':
      if (form.radiatorType === 'Radiatorudskiftning') {
        min = 3000;
        max = 6500;
        disclaimers.push('Radiatorudskiftning afhænger i høj grad af eksisterende installation og kan kræve besigtigelse.');
      } else {
        min = 1500;
        max = 2800;
      }
      included = ['Standard udskiftning'];
      if (form.installation === 'Ja, men der skal måske tilpasses') {
        min += 500;
        max += 2000;
      }
      if (form.installation === 'Nej, det er ny installation') manual = true;
      break;

    case 'Vaskemaskine / opvaskemaskine':
      min = 1500;
      max = 2500;
      included = ['Tilslutning ved eksisterende klar installation'];
      if (form.machineType === 'Begge dele') {
        min += 1200;
        max += 2500;
      }
      if (form.installation === 'Ja, men der skal måske tilpasses') {
        min += 500;
        max += 1500;
      }
      if (form.installation === 'Nej, det er ny installation') {
        min += 1500;
        max += 3500;
      }
      break;

    case 'Afløb / vandlås':
      min = 1000;
      max = 1800;
      included = ['Mindre afløbsarbejde'];
      if (form.drainType === 'Gulvafløb') {
        min += 1200;
        max += 3000;
        disclaimers.push('Gulvafløb kan kræve mere omfattende arbejde end standardopgaver.');
      }
      if (form.access === 'Trang / svært') {
        min += 300;
        max += 800;
      }
      if (form.access === 'Meget svært') {
        min += 700;
        max += 1600;
      }
      if (form.installation === 'Ja, men der skal måske tilpasses') {
        min += 400;
        max += 1200;
      }
      break;

    case 'Lækage / problem':
      min = 1500;
      max = 3500;
      included = ['Fejlfinding', 'Mindre reparation hvis muligt'];
      disclaimers.push('Ved skjulte skader eller større reparationer kræves besigtigelse.');
      if (form.leakType === 'Lækker') {
        min += 300;
        max += 1500;
      }
      break;

    case 'Varmtvandsbeholder / pumpe':
      manual = true;
      disclaimers.push('Denne type opgave vurderes bedst manuelt for at sikre korrekt løsning og pris.');
      break;

    default:
      manual = true;
  }

  if (form.urgency === 'Akut') {
    min += settings.acuteMin;
    max += settings.acuteMax;
  } else if (form.urgency === 'Inden for få dage') {
    min += settings.fastMin;
    max += settings.fastMax;
  }

  if (form.zip && !String(form.zip).startsWith('1') && !String(form.zip).startsWith('2')) {
    min += settings.zoneMin;
    max += settings.zoneMax;
  }

  return { min, max, manual, included, disclaimers };
}
