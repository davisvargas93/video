import { Component, OnInit, ViewChild, ElementRef, Renderer2} from '@angular/core';
import { BrowserPDF417Reader, } from '@zxing/library';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('video', { static: true }) videoElement: ElementRef;
  @ViewChild('canvas', { static: true }) canvas: ElementRef;

  title = 'barcode';
  codeReader = new BrowserPDF417Reader();
  img = document.getElementById('img') as HTMLImageElement;

  video: any;
  constraints = {
    video: {
      facingMode: "environment",
      width: { ideal: 4096 },
      height: { ideal: 2160 }
    }
  };
  localStream: MediaStream;
  videoWidth = 0;
  videoHeight = 0;
  base64img: any;
  constructor(private renderer: Renderer2) { }
  async decode(url: string){
    try {
      const result = await this.codeReader.decodeFromImageUrl(url);
      console.log(result);
    } catch (err) {
      console.error(err);
    }

  }
  ngOnInit() {
    this.startCamera();
  }
  startCamera() {
    if (!!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)) {
      navigator.mediaDevices.getUserMedia(this.constraints).then(this.attachVideo.bind(this)).catch(this.handleError);
    } else {
      console.log('Perdon', 'Camara no disponible.', 'warning');
    }
  }
  attachVideo(stream) {
    this.localStream = stream
    this.renderer.setProperty(this.videoElement.nativeElement, 'srcObject', stream);
    this.renderer.listen(this.videoElement.nativeElement, 'play', (event) => {
      this.videoHeight = this.videoElement.nativeElement.videoHeight;
      this.videoWidth = this.videoElement.nativeElement.videoWidth;
    });
  }
  handleError(error) {
    console.log('Error: ', error);
  }

  capture() {
    this.renderer.setProperty(this.canvas.nativeElement, 'width', this.videoWidth);
    this.renderer.setProperty(this.canvas.nativeElement, 'height', this.videoHeight);
    this.canvas.nativeElement.getContext('2d').drawImage(this.videoElement.nativeElement, 0, 0);
    let photo = document.querySelector('#img')
    this.disableVideo()
    // this.base64img = this.canvas.nativeElement.toDataURL().toString().split('base64,')[1];
    // console.log(this.base64img);
    
    photo.setAttribute('src', this.canvas.nativeElement.toDataURL('image/png'));
    console.log(photo.getAttribute('src').toString());
    //photo.getAttribute('src');
    //decode(photo.getAttribute('src'));
  }

  disableVideo(){
    let video = document.getElementById('video')
    video.style.display = 'none'
    let photo = document.getElementById('img')
    photo.style.display = 'block'
  }


}
