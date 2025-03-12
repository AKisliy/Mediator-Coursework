import { FaTelegram } from 'react-icons/fa';
import ProviderButton from './provider-button';

export default function TelegramButton() {
  return (
    <ProviderButton hiddenText="Login with Telegram" icon={<FaTelegram />} />
  );
}
