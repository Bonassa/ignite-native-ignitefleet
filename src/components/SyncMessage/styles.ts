import styled from 'styled-components/native';

export type ConnectionMessageStylesProps = {
  width: number;
  paddingTop: number;
};

export const Container = styled.View<ConnectionMessageStylesProps>`
  width: ${({ width }) => width}px;
  padding-top: ${({ paddingTop }) => paddingTop + 4}px;

  position: absolute;
  z-index: 1;

  background-color: ${({ theme }) => theme.COLORS.GRAY_500};
  padding-bottom: 4px;

  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const Title = styled.Text`
  color: ${({ theme }) => theme.COLORS.GRAY_100};
  font-size: ${({ theme }) => theme.FONT_SIZE.SM}px;
  font-family: ${({ theme }) => theme.FONT_FAMILY.REGULAR};

  margin-left: 12px;
`;
