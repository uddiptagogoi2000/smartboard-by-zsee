import { useSearchParams } from "react-router-dom";

const DeviceDetailsPage = () => {
  const [searchParams] = useSearchParams();
  const name = searchParams.get('name') ?? '';
  const deviceId = searchParams.get('deviceId') ?? '';
  
  return (
    <div>
      <h1>Device Details</h1>
      <p>Name: {name}</p>
      <p>Device ID: {deviceId}</p>
    </div>
  )
}

export default DeviceDetailsPage