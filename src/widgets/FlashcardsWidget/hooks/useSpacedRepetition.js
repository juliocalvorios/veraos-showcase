// FlashcardsWidget/expanded/hooks/useSpacedRepetition.js

/**
 * Hook for spaced repetition functionality
 * Now uses the core SpacedRepetitionService
 */

import { useState, useCallback } from 'react';
import { useFlashcards } from '../../core/providers/FlashcardsProvider';

const useSpacedRepetition = (algorithm = 'SM-2') => {
  const { service, updateCard } = useFlashcards();
  
  const [currentAlgorithm, setCurrentAlgorithm] = useState(algorithm);
  const [processingCard, setProcessingCard] = useState(false);
  
  // Process a review using the selected algorithm
  const processReview = useCallback(async (card, quality) => {
    if (!service?.spacedRepetitionService) {
      console.warn('SpacedRepetitionService not available');
      return card;
    }
    
    setProcessingCard(true);
    
    try {
      // Set the algorithm
      service.spacedRepetitionService.setAlgorithm(currentAlgorithm);
      
      // Process the review
      const updatedCard = await service.spacedRepetitionService.processReview(card, quality);
      
      // Update the card in storage
      await updateCard(card.id, updatedCard);
      
      return updatedCard;
      
    } catch (error) {
      console.error('Error processing review:', error);
      throw error;
    } finally {
      setProcessingCard(false);
    }
  }, [service, currentAlgorithm, updateCard]);
  
  // Calculate next review date
  const calculateNextReview = useCallback((card, quality) => {
    if (!service?.spacedRepetitionService) {
      return new Date();
    }
    
    service.spacedRepetitionService.setAlgorithm(currentAlgorithm);
    return service.spacedRepetitionService.calculateNextReview(card, quality);
  }, [service, currentAlgorithm]);
  
  // Get optimal review time
  const getOptimalReviewTime = useCallback((card) => {
    if (!service?.spacedRepetitionService) {
      return null;
    }
    
    return service.spacedRepetitionService.getOptimalReviewTime(card);
  }, [service]);
  
  // Switch algorithm
  const switchAlgorithm = useCallback((newAlgorithm) => {
    const validAlgorithms = ['SM-2', 'FSRS', 'Anki'];
    
    if (!validAlgorithms.includes(newAlgorithm)) {
      console.error(`Invalid algorithm: ${newAlgorithm}`);
      return false;
    }
    
    setCurrentAlgorithm(newAlgorithm);
    
    if (service?.spacedRepetitionService) {
      service.spacedRepetitionService.setAlgorithm(newAlgorithm);
    }
    
    return true;
  }, [service]);
  
  // Get algorithm statistics
  const getAlgorithmStats = useCallback(() => {
    if (!service?.spacedRepetitionService) {
      return null;
    }
    
    return service.spacedRepetitionService.getStatistics();
  }, [service]);
  
  // Optimize parameters (for FSRS)
  const optimizeParameters = useCallback(async (reviewHistory) => {
    if (!service?.spacedRepetitionService) {
      return null;
    }
    
    if (currentAlgorithm !== 'FSRS') {
      console.warn('Parameter optimization is only available for FSRS algorithm');
      return null;
    }
    
    return service.spacedRepetitionService.optimizeParameters(reviewHistory);
  }, [service, currentAlgorithm]);
  
  // Reschedule card
  const rescheduleCard = useCallback(async (card, newInterval) => {
    if (!card) return null;
    
    const rescheduledCard = {
      ...card,
      interval: newInterval,
      nextReview: Date.now() + (newInterval * 24 * 60 * 60 * 1000),
      updatedAt: Date.now()
    };
    
    await updateCard(card.id, rescheduledCard);
    return rescheduledCard;
  }, [updateCard]);
  
  // Reset card progress
  const resetCard = useCallback(async (card) => {
    if (!card) return null;
    
    const resetCard = {
      ...card,
      interval: 0,
      easeFactor: 2.5,
      reviews: 0,
      lapses: 0,
      nextReview: Date.now(),
      lastReview: null,
      updatedAt: Date.now()
    };
    
    await updateCard(card.id, resetCard);
    return resetCard;
  }, [updateCard]);
  
  // Bury card (hide until tomorrow)
  const buryCard = useCallback(async (card) => {
    if (!card) return null;
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const buriedCard = {
      ...card,
      buried: true,
      buriedUntil: tomorrow.getTime(),
      updatedAt: Date.now()
    };
    
    await updateCard(card.id, buriedCard);
    return buriedCard;
  }, [updateCard]);
  
  // Suspend card (hide indefinitely)
  const suspendCard = useCallback(async (card) => {
    if (!card) return null;
    
    const suspendedCard = {
      ...card,
      suspended: !card.suspended,
      updatedAt: Date.now()
    };
    
    await updateCard(card.id, suspendedCard);
    return suspendedCard;
  }, [updateCard]);
  
  // Get review forecast
  const getReviewForecast = useCallback((cards, days = 30) => {
    if (!service?.spacedRepetitionService) {
      return [];
    }
    
    return service.spacedRepetitionService.getForecast(cards, days);
  }, [service]);
  
  // Calculate retention rate
  const calculateRetention = useCallback((cards) => {
    if (!cards || cards.length === 0) return 0;
    
    const reviewedCards = cards.filter(c => c.reviews > 0);
    if (reviewedCards.length === 0) return 0;
    
    const totalReviews = reviewedCards.reduce((sum, c) => sum + c.reviews, 0);
    const totalLapses = reviewedCards.reduce((sum, c) => sum + (c.lapses || 0), 0);
    
    if (totalReviews === 0) return 0;
    
    return Math.round(((totalReviews - totalLapses) / totalReviews) * 100);
  }, []);
  
  // Calculate average ease
  const calculateAverageEase = useCallback((cards) => {
    if (!cards || cards.length === 0) return 2.5;
    
    const reviewedCards = cards.filter(c => c.reviews > 0);
    if (reviewedCards.length === 0) return 2.5;
    
    const totalEase = reviewedCards.reduce((sum, c) => sum + (c.easeFactor || 2.5), 0);
    return (totalEase / reviewedCards.length).toFixed(2);
  }, []);
  
  // Get learning statistics
  const getLearningStats = useCallback((cards) => {
    const now = Date.now();
    
    const stats = {
      total: cards.length,
      new: 0,
      learning: 0,
      review: 0,
      due: 0,
      suspended: 0,
      buried: 0,
      mastered: 0
    };
    
    cards.forEach(card => {
      if (card.suspended) {
        stats.suspended++;
      } else if (card.buried && card.buriedUntil > now) {
        stats.buried++;
      } else if (!card.reviews || card.reviews === 0) {
        stats.new++;
      } else if (card.interval < 1) {
        stats.learning++;
      } else if (card.interval >= 21) {
        stats.mastered++;
      } else {
        stats.review++;
      }
      
      if (card.nextReview && card.nextReview <= now && !card.suspended && !card.buried) {
        stats.due++;
      }
    });
    
    return stats;
  }, []);
  
  return {
    // Current algorithm
    currentAlgorithm,
    processingCard,
    
    // Core functions
    processReview,
    calculateNextReview,
    getOptimalReviewTime,
    switchAlgorithm,
    
    // Card management
    rescheduleCard,
    resetCard,
    buryCard,
    suspendCard,
    
    // Statistics
    getAlgorithmStats,
    getReviewForecast,
    calculateRetention,
    calculateAverageEase,
    getLearningStats,
    
    // Advanced
    optimizeParameters
  };
};

export default useSpacedRepetition;