import { Language, Translation } from '../types';
import no from './no';
import en from './en';
import se from './se';
import dk from './dk';
import de from './de';

const translations: Record<Language, Translation> = {
  no,
  en,
  se,
  dk,
  de,
};

export default translations;