import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-table-header',
  templateUrl: './table-header.component.html',
  styleUrls: ['./table-header.component.css']
})
export class TableHeaderComponent implements OnInit {
  @Input() data?: string[];
  constructor() { }

  ngOnInit(): void {
  }

}
