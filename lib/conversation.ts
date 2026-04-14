import { OPTION_SETS } from './config';
import { ConversationItem, FormState } from './types';

export function getConversationPlan(form: FormState): ConversationItem[] {
  const items: ConversationItem[] = [{ key: 'task', type: 'task' }];

  switch (form.task) {
    case 'Toilet':
      items.push({ key: 'toiletWork', type: 'options', options: OPTION_SETS.toiletWork, label: 'Hvad skal der laves?' });
      items.push({ key: 'installation', type: 'options', options: OPTION_SETS.installation, label: 'Hvordan ser den nuværende installation ud?' });
      items.push({ key: 'delivery', type: 'options', options: OPTION_SETS.delivery, label: "Har du selv produktet, eller skal VVS'eren levere det?" });
      items.push({ key: 'toiletType', type: 'options', options: OPTION_SETS.toiletType, label: 'Er toilettet gulvstående eller væghængt?' });
      break;
    case 'Armatur':
      items.push({ key: 'armaturType', type: 'options', options: OPTION_SETS.armaturType, label: 'Hvilket armatur drejer det sig om?' });
      items.push({ key: 'installation', type: 'options', options: OPTION_SETS.installation, label: 'Er det en udskiftning eller ny installation?' });
      items.push({ key: 'delivery', type: 'options', options: OPTION_SETS.delivery, label: "Har du selv produktet, eller skal VVS'eren levere?" });
      break;
    case 'Bruser':
      items.push({ key: 'bruserType', type: 'options', options: OPTION_SETS.bruserType, label: 'Hvad skal der laves i bruseområdet?' });
      items.push({ key: 'delivery', type: 'options', options: OPTION_SETS.delivery, label: "Har du selv produktet, eller skal VVS'eren levere?" });
      break;
    case 'Radiator':
      items.push({ key: 'radiatorType', type: 'options', options: OPTION_SETS.radiatorType, label: 'Hvad drejer radiatoropgaven sig om?' });
      items.push({ key: 'installation', type: 'options', options: OPTION_SETS.installation, label: 'Hvordan ser den nuværende installation ud?' });
      break;
    case 'Vaskemaskine / opvaskemaskine':
      items.push({ key: 'machineType', type: 'options', options: OPTION_SETS.machineType, label: 'Hvilken maskine drejer det sig om?' });
      items.push({ key: 'installation', type: 'options', options: OPTION_SETS.installation, label: 'Er tilslutningerne allerede klar?' });
      break;
    case 'Afløb / vandlås':
      items.push({ key: 'drainType', type: 'options', options: OPTION_SETS.drainType, label: 'Hvad passer bedst på opgaven?' });
      items.push({ key: 'installation', type: 'options', options: OPTION_SETS.installation, label: 'Er det en standard udskiftning eller kræver det tilpasning?' });
      break;
    case 'Lækage / problem':
      items.push({ key: 'leakType', type: 'options', options: OPTION_SETS.leakType, label: 'Hvad oplever du?' });
      break;
    case 'Varmtvandsbeholder / pumpe':
      items.push({ key: 'tankType', type: 'options', options: OPTION_SETS.tankType, label: 'Hvilken type opgave drejer det sig om?' });
      break;
    case 'Andet':
      items.push({ key: 'details', type: 'textarea', label: 'Beskriv kort opgaven' });
      break;
  }

  if (form.task && form.task !== 'Andet') {
    items.push({ key: 'level', type: 'options', options: OPTION_SETS.level, label: 'Hvilket niveau ønsker du?' });
    items.push({ key: 'access', type: 'options', options: OPTION_SETS.access, label: 'Er der usædvanligt trange adgangsforhold?' });
    items.push({ key: 'propertyType', type: 'options', options: OPTION_SETS.propertyType, label: 'Hvilken type bolig er det?' });
    items.push({ key: 'urgency', type: 'options', options: OPTION_SETS.urgency, label: 'Hvornår skal det laves?' });
    items.push({ key: 'zip', type: 'input', label: 'Hvad er postnummeret?', placeholder: 'Fx 2100' });
    items.push({ key: 'address', type: 'address', label: 'Hvad er adressen?', placeholder: 'Begynd at skrive adressen' });
    items.push({ key: 'images', type: 'images', label: 'Har du billeder? Det er valgfrit, men giver ofte et bedre estimat.' });
    items.push({ key: 'details', type: 'textarea', label: 'Er der andet, vi bør vide?', optional: true });
    items.push({ key: 'acceptPrice', type: 'options', options: OPTION_SETS.budgetFit, label: 'Hvis prisen ligger i det estimerede niveau, passer det så dig?' });
    items.push({ key: 'wantContact', type: 'options', options: OPTION_SETS.contactChoice, label: "Vil du gerne kontaktes af en VVS'er, når vi er færdige?" });
    items.push({ key: 'name', type: 'input', label: 'Hvad er dit navn?', placeholder: 'Fulde navn', condition: (state) => state.wantContact === 'Ja, kontakt mig' });
    items.push({ key: 'phone', type: 'input', label: 'Hvad er dit telefonnummer?', placeholder: 'Telefonnummer', condition: (state) => state.wantContact === 'Ja, kontakt mig' });
    items.push({ key: 'email', type: 'input', label: 'Hvad er din email?', placeholder: 'navn@email.dk', condition: (state) => state.wantContact === 'Ja, kontakt mig' });
  }

  return items.filter((item) => !item.condition || item.condition(form));
}
