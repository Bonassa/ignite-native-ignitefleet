import { useUser, useApp } from '@realm/react';
import { Power } from 'phosphor-react-native';
import { TouchableOpacity } from 'react-native';

import { Container, Greeting, Message, Name, Picture } from './styles';
import theme from '../../theme';

export const HomeHeader: React.FC = () => {
  const user = useUser();
  const app = useApp();

  function handleLogout() {
    app.currentUser?.logOut();
  }

  return (
    <Container>
      <Picture
        source={{ uri: user?.profile.pictureUrl }}
        placeholder="L184i9kCbIof00ayjZay~qj[ayj@"
      />
      <Greeting>
        <Message>Olá</Message>
        <Name>{user?.profile.name}</Name>
      </Greeting>

      <TouchableOpacity activeOpacity={0.7} onPress={handleLogout}>
        <Power size={32} color={theme.COLORS.GRAY_400} />
      </TouchableOpacity>
    </Container>
  );
};
