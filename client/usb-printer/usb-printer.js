export class USBPrinter {
  constructor(
    filters = [
      {
        vendorId: 0x0a5f /* zebra */
      }
    ]
  ) {
    this.filters = filters
  }

  async setup() {
    var devices = await navigator.usb.getDevices()
    if (devices.length > 0) {
      this.device = devices[0]

      await this.device.open()
      if (this.device.configurations) {
        await this.device.selectConfiguration(1)
        await this.device.claimInterface(0)
      }
    }
  }

  async read() {
    const { endpointNumber } = this.device.configuration.interfaces[0].alternate.endpoints[0]

    var result = await this.device.transferIn(endpointNumber, 64)
    var textDecoder = new TextDecoder()

    return textDecoder.decode(result.data)
  }

  async print(content) {
    var encoder = new TextEncoder()
    var data = encoder.encode(content)

    const { endpointNumber } = this.device.configuration.interfaces[0].alternates[0].endpoints[1]
    await this.device.transferOut(endpointNumber, data)
  }

  async connectAndPrint(content) {
    if (!this.device) {
      var selectedDevice = await navigator.usb.requestDevice({
        filters: this.filters
      })

      this.device = selectedDevice
      console.log(this.device)

      await this.setup(this.device)
      await this.print(content)
    } else {
      await this.print(content)
    }
  }

  disconnect() {
    this.device && this.device.disconnect()
  }
}
