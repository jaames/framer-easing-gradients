import * as React from "react";
import { Frame, PropertyControls, ControlType } from "framer";

// https://github.com/gka/chroma.js 
import chroma from "chroma-js";

// https://github.com/larsenwork/easing-coordinates
import { cubicCoordinates, stepsCoordinates } from "easing-coordinates";

// references:
// https://github.com/larsenwork/sketch-easing-gradient/blob/4c6bc911df5c454e36dcd46b1c664067636393fb/resources/store/index.js#L37
// https://github.com/larsenwork/postcss-easing-gradients/blob/master/lib/colorStops.js

const easeMap = {
  'ease-in-out': {
    x1: 0.42,
    y1: 0,
    x2: 0.58,
    y2: 1,
  },
  'ease-out': {
    x1: 0,
    y1: 0,
    x2: 0.58,
    y2: 1,
  },
  'ease-in': {
    x1: 0.42,
    y1: 0,
    x2: 1,
    y2: 1,
  },
  'ease': {
    x1: 0.25,
    y1: 0.1,
    x2: 0.25,
    y2: 1,
  },
  'linear': {
    x1: 0.25,
    y1: 0.25,
    x2: 0.75,
    y2: 0.75,
  },
};

// Define type of property
interface Props {
  from: string;
  to: string;
  angle: number;
  stops: number;
  colorMode: string;
  colorEasing: string;
  width: number;
  height: number;
}

export class EasingGradient extends React.Component<Props> {

    static displayName = "Easing Gradient";

    // Set default properties
    static defaultProps = {
      from: '#fff',
      to: '#000',
      angle: 0,
      stops: 8,
      colorMode: 'lrgb',
      colorEasing: 'linear',
    }

    // Items shown in property panel
    static propertyControls: PropertyControls = {
      from: {
        type: ControlType.Color,
        title: 'Start Color'
      },
      to: {
        type: ControlType.Color, 
        title: 'Stop Color'
      },
      angle: {
        type: ControlType.Number,
        title: 'Angle',
        max: 360,
        min: 0,
        unit: '°'
      },
      stops: {
        type: ControlType.Number,
        title: 'Color Stops',
        max: 25,
        min: 2,
      },
      colorEasing: {
        type: ControlType.Enum,
        title: 'Color Easing',
        options: ['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out', 'steps'],
        optionTitles: ['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out', 'steps']
      },
      colorMode: {
        type: ControlType.Enum,
        title: 'Color Mode',
        options: ['rgb', 'hsl', 'lab', 'lch', 'lrgb'],
        optionTitles: ['rgb', 'hsl', 'lab', 'lch', 'lrgb']
      },
    }

    render() {

      const {
        to, 
        from, 
        angle, 
        stops, 
        colorMode, 
        colorEasing,
        width,
        height,
      } = this.props;
      let coords;

      if (colorEasing === 'steps') {
        coords = stepsCoordinates(stops, 'skip-none');
      } else {
        const {x1, y1, x2, y2} = easeMap[colorEasing];
        coords = cubicCoordinates(x1, y1, x2, y2, stops);
      }

      const colorStops = coords.map(({x, y}) => {
        let color = chroma.mix(to, from, y, colorMode).css('hsl');
        return `${color} ${(x * 100).toFixed(2)}%`;
      });

      return (
        <Frame 
          width={width}
          height={height}
          background={`linear-gradient(${angle}deg, ${colorStops.join(', ')})`}
        ></Frame>
      );
    }
}
