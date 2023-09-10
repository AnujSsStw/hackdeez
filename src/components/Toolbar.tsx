import { Circle, FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";

const Component = () => (
  <FeatureGroup>
    <EditControl
      position="topright"
      onEdited={this._onEditPath}
      onCreated={this._onCreate}
      onDeleted={this._onDeleted}
      draw={{
        rectangle: false,
      }}
    />
    <Circle center={[51.51, -0.06]} radius={200} />
  </FeatureGroup>
);

export default Component;
