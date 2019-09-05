import { USBPrinter } from '../usb-printer/usb-printer'

var printer

export async function usbLabelPrinterHandler(
  { type: printerType, name: printerName, txtRecord },
  { accept, content, name, options }
) {
  const board = typeof content == 'function' ? await content.call() : content

  try {
    if (!printer) {
      printer = new USBPrinter()
    }

    await printer.connectAndPrint(board)
  } catch (e) {
    throw new Error(e)
  }
}
