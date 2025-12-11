import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- 修复 Leaflet 默认图标在 Webpack/Vite 下不显示的问题 ---
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// --- 辅助组件：用于控制地图跳转 ---
// Leaflet 的 MapContainer 是不可变的，需要这个钩子来改变视角
function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, {
      duration: 2 // 动画持续2秒，丝滑飞过去
    });
  }, [center, zoom, map]); // 当 center 或 zoom 变化时触发
  return null;
}

// --- 主地图组件 ---
interface TravelMapProps {
  center: [number, number]; // 经纬度 [纬度, 经度]
  zoom: number;             // 缩放级别
}

export default function TravelMap({ center, zoom }: TravelMapProps) {
  return (
    <MapContainer 
      center={center} 
      zoom={zoom} 
      style={{ height: '300px', width: '100%', borderRadius: '8px', marginBottom: '20px', zIndex: 0 }}
      scrollWheelZoom={false} // 禁止鼠标滚轮缩放，防止在大页面滚动时卡住
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* 这是一个隐形的组件，负责监听坐标变化并移动地图 */}
      <ChangeView center={center} zoom={zoom} />
      
      <Marker position={center}>
        <Popup>
          这里是您的目的地！
        </Popup>
      </Marker>
    </MapContainer>
  );
}