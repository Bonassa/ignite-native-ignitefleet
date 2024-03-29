import { Container, Info, Label, Description } from './styles';
import { IconBox, IconBoxProps } from '../IconBox';

export type LocationInfoProps = {
  label: string;
  description: string;
};

type Props = LocationInfoProps & {
  icon: IconBoxProps;
};

export const LocationInfo: React.FC<Props> = ({ description, label, icon }) => {
  return (
    <Container>
      <IconBox icon={icon} />

      <Info>
        <Label numberOfLines={1}>{label}</Label>

        <Description numberOfLines={1}>{description}</Description>
      </Info>
    </Container>
  );
};
