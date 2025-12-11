import { useState } from 'react';
import { Layout, Card, Form, Input, InputNumber, Button, DatePicker, Timeline, Typography, Row, Col, Grid, Space, Tag, message } from 'antd';
import { RocketOutlined, ClockCircleOutlined, EnvironmentOutlined, SettingOutlined } from '@ant-design/icons';
import axios from 'axios'; // 引入请求工具
import TravelMap from './TravelMap'; // 引入刚才写的地图组件

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;
const { useBreakpoint } = Grid;

function App() {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<string[]>([]);
  
  // 新增：地图状态管理
  // 默认中心点：中国地理中心大致位置 (西安附近)，缩放 4 看全中国
  const [mapCenter, setMapCenter] = useState<[number, number]>([35.8617, 104.1954]);
  const [mapZoom, setMapZoom] = useState(4);

  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const onFinish = async (values: any) => {
    setLoading(true);
    
    // 1. 先尝试获取目的地坐标 (Geocoding)
    try {
      // 使用 OpenStreetMap 的免费搜索接口
      const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
        params: {
          q: values.destination, // 用户输入的城市
          format: 'json',
          limit: 1
        }
      });

      if (response.data && response.data.length > 0) {
        const location = response.data[0];
        const lat = parseFloat(location.lat);
        const lon = parseFloat(location.lon);
        
        // 更新地图：飞到该城市，并放大到 10 级
        setMapCenter([lat, lon]);
        setMapZoom(12);
      } else {
        message.warning('未找到该地址的坐标，地图将保持原样');
      }
    } catch (error) {
      console.error("获取坐标失败", error);
      // 不阻断流程，继续生成文字计划
    }

    // 2. 模拟生成行程 (Mock AI)
    setTimeout(() => {
      const mockResult = [
        `Day 1: 抵达 ${values.destination}，入住市中心酒店。晚上去步行街寻找美食。`,
        `Day 2: 深度游览 ${values.destination} 的著名景点，感受当地文化。`,
        `Day 3: 自由活动，购买纪念品，准备返程。`
      ];
      setPlan(mockResult);
      setLoading(false);
    }, 1000);
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Header style={{ 
        display: 'flex', alignItems: 'center', background: '#001529', padding: '0 24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)', zIndex: 10
      }}>
        <RocketOutlined style={{ fontSize: '24px', color: '#1890ff', marginRight: '10px' }} />
        <Title level={4} style={{ color: 'white', margin: 0 }}>智能旅游计划生成器</Title>
      </Header>

      <Content style={{ padding: '24px', width: '100%' }}>
        <Row gutter={[24, 24]}>
          
          {/* 左侧：输入区 */}
          <Col xs={24} md={9} lg={7} xl={6} xxl={5} style={{ minWidth: '300px' }}>
            <Card title={<><SettingOutlined /> 制定行程参数</>} bordered={false} style={{ height: '100%', borderRadius: '8px' }}>
              <Form layout="vertical" onFinish={onFinish} initialValues={{ days: 3 }}>
                <Form.Item label="目的地" name="destination" rules={[{ required: true, message: '请输入目的地' }]}>
                  <Input prefix={<EnvironmentOutlined />} placeholder="输入城市，如：杭州" size="large" />
                </Form.Item>
                
                {/* 省略其他表单项以节省空间，保持你之前的代码即可... */}
                <Form.Item label="游玩天数" name="days"><InputNumber min={1} max={15} style={{ width: '100%' }} size="large" /></Form.Item>
                <Form.Item label="出发日期" name="date"><DatePicker style={{ width: '100%' }} size="large" /></Form.Item>
                <Form.Item label="特殊偏好" name="preferences"><TextArea rows={4} placeholder="例如：特种兵旅游..." /></Form.Item>

                <Form.Item style={{ marginTop: '20px' }}>
                  <Button type="primary" htmlType="submit" loading={loading} block size="large" shape="round" icon={<RocketOutlined />}>
                    开始生成行程
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          {/* 右侧：地图 + 结果展示区 */}
          <Col xs={24} md={15} lg={17} xl={18} xxl={19} style={{ display: 'flex', flexDirection: 'column' }}>
            <Card title="📅 您的专属行程" bordered={false} style={{ flex: 1, minHeight: '600px', borderRadius: '8px' }}>
              
              {/* --- 这里插入地图组件 --- */}
              <div style={{ marginBottom: '20px', border: '1px solid #f0f0f0', borderRadius: '8px', overflow: 'hidden' }}>
                 <TravelMap center={mapCenter} zoom={mapZoom} />
              </div>

              {plan.length === 0 ? (
                <div style={{ textAlign: 'center', color: '#999', padding: '40px' }}>
                  <ClockCircleOutlined style={{ fontSize: '48px', marginBottom: '20px', color: '#e6e6e6' }} />
                  <Title level={4} style={{ color: '#ccc' }}>等待生成...</Title>
                </div>
              ) : (
                <div className="animate-fade-in"> 
                  <Space style={{ marginBottom: 24 }}><Tag color="geekblue"># 舒适节奏</Tag><Tag color="purple"># 深度游</Tag></Space>
                  <Timeline
                    mode={isMobile ? "left" : "alternate"}
                    items={plan.map((item, index) => ({
                      label: <Text strong>Day {index + 1}</Text>,
                      children: <Card hoverable size="small" style={{background: index%2===0?'#f9faff':'#fff'}}>{item}</Card>,
                      color: 'blue'
                    }))}
                  />
                </div>
              )}
            </Card>
          </Col>
        </Row>
      </Content>
      <Footer style={{ textAlign: 'center', background: 'transparent', color: '#888' }}>AI Travel Planner ©2025</Footer>
    </Layout>
  );
}

export default App;