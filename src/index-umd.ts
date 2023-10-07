import PdfPrinter from './ol-pdf-printer';
import * as utils from './ol-pdf-printer';

// make enums and other methods accesible
Object.assign(PdfPrinter, utils);
export default PdfPrinter;
