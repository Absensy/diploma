'use client';

import React from 'react';
import { StyledDivider, LineDivider, IconContainer } from './GranitDividerWithIcon.Styles';
import ArrowDownIcon from '@/icons/arrowDown';


export const DividerWithIcon = () => {
  return (
    <StyledDivider>
      <LineDivider>
        <IconContainer>
          <ArrowDownIcon/>
        </IconContainer>
      </LineDivider>
    </StyledDivider>
  );
};
