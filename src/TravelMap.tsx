import { useRef, useEffect, useState } from 'react';
// 1. 引入必要的组件
import Map, { Marker, NavigationControl } from 'react-map-gl/maplibre'; 
import type { MapRef } from 'react-map-gl'; 
import 'maplibre-gl/dist/maplibre-gl.css'; 
// 2. 引入新图标：太阳和月亮
import { EnvironmentOutlined, SunOutlined, MoonOutlined } from '@ant-design/icons';
import { Button, Tooltip } from 'antd'; // 引入 Antd 按钮组件

// --- 定义两套地图样式 URL ---
const DARK_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';
const LIGHT_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';

const markerStyle: React.CSSProperties = {
  color: '#1890ff',
  fontSize: '36px',
  filter: 'drop-shadow(0 0 10px rgba(24, 144, 255, 0.8))',
  animation: 'pulse-glow 2s ease-in-out infinite',
  cursor: 'pointer',
  transform: 'translateY(-50%)'
};

interface TravelMapProps {
  center: [number, number]; 
  zoom: number;
}

export default function TravelMap({ center, zoom }: TravelMapProps) {
  const mapRef = useRef<MapRef>(null);
  
  // --- 新增：控制深色模式的状态 ---
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [center[1], center[0]], 
        zoom: zoom,
        pitch: 60, 
        bearing: 0, 
        duration: 2000, 
        essential: true 
      });
    }
  }, [center, zoom]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '400px' }}>
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: center[1], 
          latitude: center[0],  
          zoom: zoom,
          pitch: 60, 
          bearing: -15 
        }}
        // --- 样式升级：根据状态动态切换 mapStyle ---
        mapStyle={isDarkMode ? DARK_STYLE : LIGHT_STYLE}
        
        style={{ 
          width: '100%', 
          height: '100%', 
          borderRadius: '16px',
          // 根据模式调整阴影颜色，浅色模式阴影淡一点
          boxShadow: isDarkMode 
            ? '0 10px 30px -5px rgba(0, 0, 0, 0.5)' 
            : '0 10px 30px -5px rgba(0, 0, 0, 0.2)', 
        }}
        scrollZoom={false}
        dragRotate={true}
        touchZoomRotate={true}
      >
        {/* 标准导航控件 (默认在右上角) */}
        <NavigationControl position="top-right" visualizePitch={true} />

        {/* 标记点 */}
        <Marker longitude={center[1]} latitude={center[0]} anchor="bottom">
          <EnvironmentOutlined style={markerStyle} />
        </Marker>

        {/* --- 自定义切换按钮 --- */}
        {/* 我们使用绝对定位，把它放在导航控件的左侧 */}
        <div style={{ position: 'absolute', top: 10, right: 50, zIndex: 1 }}>
          <Tooltip title={isDarkMode ? "切换到浅色模式" : "切换到深色模式"}>
            <Button
              shape="circle"
              icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
              onClick={() => setIsDarkMode(!isDarkMode)}
              style={{
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.2)' : 'white', // 深色模式下半透明，浅色下白色
                color: isDarkMode ? 'white' : '#333',
                border: isDarkMode ? '1px solid rgba(255,255,255,0.3)' : '1px solid #d9d9d9',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
              }}
            />
          </Tooltip>
        </div>
      </Map>
    </div>
  );
}