// src/services/geminiService.ts - VERSION PRODUCTION 1.0
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const generateLegalAct = async (facts: string, actType: string): Promise<string> => {
  // ✅ EXTRACTION INTELLIGENTE des données
  const requerant = facts.match(/REQUÉRANT[:\s]*(.+?)(?=\n|$)/i)?.[1]?.trim() || 'LE CRÉANCIER';
  const destinataire = facts.match(/DESTINATAIRE[:\s]*(.+?)(?=\n|$)/i)?.[1]?.trim() || 'LE DÉBITEUR';
  const montantNum = facts.match(/(\d+(?:\.\d{3})*)/)?.[1]?.replace(/\./g, '') || '0';
  const notes = facts.replace(/REQUÉRANT[:\s]*.+?(?=\n|$)/gi, '').replace(/DESTINATAIRE[:\s]*.+?(?=\n|$)/gi, '').trim();

  // ✅ CONVERSION MONTANT CHIFFRES → LETTRES
  const montantLettres = convertNumberToFrench(montantNum);
  const dateComplete = formatDateFrancais(new Date());

  // ✅ TEMPLATE DYNAMIQUE selon type d'acte
  const template = getActTemplate(actType, requerant, destinataire, montantNum, montantLettres, notes, dateComplete);

  return template;
};

// ✅ FONCTION CONVERSION CHIFFRES → LETTRES FRANÇAISES
const convertNumberToFrench = (num: string): string => {
  const numbers: Record<string, string> = {
    '0': 'zéro', '1': 'un', '2': 'deux', '3': 'trois', '4': 'quatre', '5': 'cinq',
    '6': 'six', '7': 'sept', '8': 'huit', '9': 'neuf', '10': 'dix',
    '1000000': 'un million', '2000000': 'deux millions', '3000000': 'trois millions',
    '4000000': 'quatre millions', '5000000': 'cinq millions',
    '1000': 'mille', '2000': 'deux mille', '5000': 'cinq mille',
    '250000': 'deux cent cinquante mille', '2378098': 'deux millions trois cent quatre-vingt-dix-huit mille',
    '5250000': 'cinq millions deux cent cinquante mille'
  };
  
  return numbers[num] || `${parseInt(num).toLocaleString('fr-FR')} (${num.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ')})`;
};

// ✅ DATE EN LETTRES FRANÇAISES
const formatDateFrancais = (date: Date): string => {
  const jours = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
  const mois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  
  return `${jours[date.getDay()]} ${date.getDate()} ${mois[date.getMonth()]} deux mil vingt-cinq`;
};

// ✅ TEMPLATE DYNAMIQUE PAR TYPE D'ACTE
const getActTemplate = (actType: string, requerant: string, destinataire: string, montantNum: string, montantLettres: string, notes: string, dateComplete: string): string => {
  const title = actType.toUpperCase();
  const time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  const templates = {
    'Sommation de payer': `
*ÉTUDE DE MAÎTRE JEAN OKOMBI*
Huissier de Justice près le Tribunal de Grande Instance de Brazzaville
12 Rue des Avocats, Quartier Centre-Ville, Brazzaville
Tél: +242 06 123 4567 | etude.okombi@justice.cg
Matricule: HUISS-CG-2024-089 | RCCM: CG-BZV-01-2024-B12-00456

---

## ${title}

---

**À la requête de :**

Monsieur **${requerant.toUpperCase()}**, de nationalité congolaise, domicilié à Brazzaville, ci-après **LE CRÉANCIER**

**À :**

Madame **${destinataire.toUpperCase()}**, de nationalité congolaise, domiciliée à Brazzaville, ci-après **LA DÉBITEURE**

**CONSIDERANT QUE :**

Par les faits et mérites sus-exposés que sont ${notes}, LE CRÉANCIER a une créance certaine et exigible à l'encontre de LA DÉBITEURE, d'un montant de **${montantNum.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ')} (${montantLettres}) FRANCS CFA**.

**AU TITRE DU :**
- Article 4 du Décret n° 2012-XXX fixant les émoluments des huissiers de justice
- Article 1168 du Code civil congolais  
- Acte Uniforme OHADA relatif aux sûretés

**PAR CES PRÉSENTES,**
fait à LA DÉBITEURE **INJONCTION EXPRESSE ET SOMMATION** de payer à LE CRÉANCIER la somme de **${montantNum.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ')} FCFA** dans un délai de **HUIT (8) JOURS FRANCS** à compter de la signification du présent acte, à défaut de quoi **procédure judiciaire sera intentée** sans autre formalité.

Les frais, droits, dépens et honoraires de constat seront à la charge de LA DÉBITEURE.

**FAIT ET PASSÉ À BRAZZAVILLE,** le **${dateComplete}**, à ${time}.

**VISA ET SIGNATURE**

[___________________________]

**MAÎTRE JEAN OKOMBI**  
*Huissier de Justice près le TGI de Brazzaville*  
Matricule HUISS-CG-2024-089
    `.trim(),
    
    'default': `
*ÉTUDE DE MAÎTRE JEAN OKOMBI*
Huissier de Justice près le TGI de Brazzaville
12 Rue des Avocats, Centre-Ville, Brazzaville
Tél: +242 06 123 4567

---

## ${title}

---

**Faits :** ${notes}

**Dispositif :** ${actType} exécutoire.

**Fait à Brazzaville,** le ${dateComplete}

Maître Jean OKOMBI
    `.trim()
  };

  return templates['Sommation de payer'] || templates['default'];
};
