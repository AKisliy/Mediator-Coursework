import { FaYandex } from 'react-icons/fa';
import ProviderButton from './provider-button';

export default function YandexButton() {
  return (
    <ProviderButton hiddenText="Register with Yandex" icon={<FaYandex />} />
  );
}
