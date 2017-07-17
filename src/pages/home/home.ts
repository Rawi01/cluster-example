import { Component } from '@angular/core';
import {GoogleMap, GoogleMaps, LatLng, Marker} from "@ionic-native/google-maps";
import {Cluster, MarkerCluster} from "cordova-plugin-googlemaps-cluster";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private markerCluster: MarkerCluster;
  private map: GoogleMap;
  private canvasElem;

  constructor(private googleMaps: GoogleMaps) {
    this.canvasElem = document.createElement("canvas");
    this.canvasElem.height = 40;
    this.canvasElem.width = 40;
  }

  ngAfterViewInit() {
    this.loadMap();
  }

  loadMap() {
    let element: HTMLElement = document.getElementById('map');

    //Create your map
    this.map = this.googleMaps.create(element, {
      'backgroundColor': 'white',
      'controls': {
        'compass': true,
        'myLocationButton': true,
        'indoorPicker': true,
        'zoom': true
      },
      'gestures': {
        'scroll': true,
        'tilt': true,
        'rotate': true,
        'zoom': true
      },
    });
    //Create your marker cluster
    this.markerCluster = new MarkerCluster(this.map, {
      //Distance between cluster center and markers, a higher value leads to less clusters
      mergeDistance: 0.4,
      //Distance modifier, change the distance on zoom change. Gets multiplied by zoom and added to merge distance.
      mergeDistanceModifier: 0,
      //Sets the maximum zoom level that should be set after tapping a cluster
      maxZoom: 20,
      //Starts spiderfy markers at this zoom level, use a big value to disable spiderfy
      spiderfyZoom: 18,
      //Stop clustering at this zoom level(show all markers), use a big value to cluster always
      maxClusterZoom: 99,
      //Function that have to return a path for the cluster image or a base64 encoded data url.
      //You can generate one based on the cluster data using an canvas to draw and call toDataURL() to get the image
      clusterIcon: (cluster) => this.getMarkerImage(cluster)
    });

    let markers = [];
    for(let i = 0; i < 10000; i++) {
      markers.push({
        'position': new LatLng(this.getRandomArbitrary(47.27, 55.1), this.getRandomArbitrary(5.87, 15.04)),
        'title': i
      })
    }
    //Add markers to the cluster
    this.markerCluster.addMarker(markers);
  }

  private getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  private getMarkerImage(cluster: Cluster) {
    let canvas = this.canvasElem.getContext('2d');
    canvas.clearRect(0,0,40,40);

    let count = cluster.getMarker().length;

    canvas.beginPath();
    canvas.fillStyle = 'red';
    canvas.arc(20, 20, 18 , 0, Math.PI*2);
    canvas.fill();
    canvas.closePath();

    canvas.beginPath();
    canvas.fillStyle = 'white';
    canvas.arc(20, 20, 15 , 0, Math.PI*2);
    canvas.fill();
    canvas.closePath();

    canvas.fillStyle = '#000';
    canvas.textAlign = 'center';
    canvas.textBaseline = 'middle';
    canvas.font = 'bold 12px sans-serif';

    canvas.fillText(count, 20, 20, 40);

    return this.canvasElem.toDataURL();
  }
}
