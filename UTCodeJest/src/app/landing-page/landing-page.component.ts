import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
})
export class LandingPageComponent implements OnInit {
  activeSection = 'onboarding';

  constructor() {}

  ngOnInit(): void {}

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    const sections = [
      'onboarding',
      'section1',
      'section2',
      'section3',
      'section4',
    ];
    let currentSection = 'onboarding';

    for (const section of sections) {
      const element = document.getElementById(section);
      if (
        element &&
        window.pageYOffset >= element.offsetTop - element.clientHeight / 3
      ) {
        currentSection = section;
      }
    }

    this.activeSection = currentSection;
  }
}
