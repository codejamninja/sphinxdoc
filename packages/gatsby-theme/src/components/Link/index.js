import React from 'react';
import styled, { withTheme } from 'styled-components';
import './index.scss';
import Link from './Link';

export default styled(
  withTheme(props => {
    return <Link {...props} />;
  })
)``;