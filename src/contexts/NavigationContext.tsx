'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { NavigationState, CampusLocation, Route, UserPosition } from '@/types';

interface NavigationContextType extends NavigationState {
  startNavigation: (origin: CampusLocation, destination: CampusLocation, route: Route) => void;
  stopNavigation: () => void;
  nextStep: () => void;
  prevStep: () => void;
  updateUserPosition: (pos: UserPosition) => void;
  setRoute: (route: Route | null) => void;
  setOrigin: (loc: CampusLocation | null) => void;
  setDestination: (loc: CampusLocation | null) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<NavigationState>({
    isNavigating: false,
    currentRoute: null,
    currentStepIndex: 0,
    origin: null,
    destination: null,
    userPosition: null,
  });

  const startNavigation = useCallback(
    (origin: CampusLocation, destination: CampusLocation, route: Route) => {
      setState({
        isNavigating: true,
        currentRoute: route,
        currentStepIndex: 0,
        origin,
        destination,
        userPosition: state.userPosition,
      });
    },
    [state.userPosition]
  );

  const stopNavigation = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isNavigating: false,
      currentRoute: null,
      currentStepIndex: 0,
      origin: null,
      destination: null,
    }));
  }, []);

  const nextStep = useCallback(() => {
    setState((prev) => {
      if (!prev.currentRoute) return prev;
      const max = prev.currentRoute.steps.length - 1;
      return { ...prev, currentStepIndex: Math.min(prev.currentStepIndex + 1, max) };
    });
  }, []);

  const prevStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStepIndex: Math.max(prev.currentStepIndex - 1, 0),
    }));
  }, []);

  const updateUserPosition = useCallback((pos: UserPosition) => {
    setState((prev) => ({ ...prev, userPosition: pos }));
  }, []);

  const setRoute = useCallback((route: Route | null) => {
    setState((prev) => ({ ...prev, currentRoute: route }));
  }, []);

  const setOrigin = useCallback((loc: CampusLocation | null) => {
    setState((prev) => ({ ...prev, origin: loc }));
  }, []);

  const setDestination = useCallback((loc: CampusLocation | null) => {
    setState((prev) => ({ ...prev, destination: loc }));
  }, []);

  return (
    <NavigationContext.Provider
      value={{
        ...state,
        startNavigation,
        stopNavigation,
        nextStep,
        prevStep,
        updateUserPosition,
        setRoute,
        setOrigin,
        setDestination,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) throw new Error('useNavigation must be used within NavigationProvider');
  return context;
}
