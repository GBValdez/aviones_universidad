import { Component } from '@angular/core';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

@Component({
  selector: 'app-tackle-ticket',
  standalone: true,
  imports: [ZXingScannerModule],
  templateUrl: './tackle-ticket.component.html',
  styleUrl: './tackle-ticket.component.scss',
})
export class TackleTicketComponent {
  cameras: MediaDeviceInfo[] = [];
  selectedCamera!: MediaDeviceInfo;

  onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.cameras = devices;
    if (devices.length > 0) {
      this.selectedCamera = devices[0];
    }
  }

  handleQrCodeResult(resultString: string): void {
    console.log('Result: ', resultString);
    // Aquí puedes manejar el resultado del escaneo
  }
}
