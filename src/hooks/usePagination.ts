import { useState, useEffect } from 'react'
import { useMediaQuery, useTheme } from '@mui/material'

export interface UsePaginationOptions {
  mobilePerPage?: number
  tabletPerPage?: number
  desktopPerPage?: number
  scrollTargetId?: string
  scrollOffset?: number
}

export const usePagination = (totalItems: number, options: UsePaginationOptions = {}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'))

  const {
    mobilePerPage = 6,
    tabletPerPage = 8,
    desktopPerPage = 12,
    scrollTargetId,
    scrollOffset = 80,
  } = options

  const itemsPerPage = isMobile ? mobilePerPage : (isTablet ? tabletPerPage : desktopPerPage)
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const [currentPage, setCurrentPage] = useState(1)
  const [visibleItems, setVisibleItems] = useState(itemsPerPage)

  useEffect(() => {
    setCurrentPage(1)
    setVisibleItems(itemsPerPage)
  }, [totalItems, itemsPerPage])

  const scrollIntoView = () => {
    if (typeof window === 'undefined') return

    if (scrollTargetId) {
      const target = document.getElementById(scrollTargetId)
      if (target) {
        const top = target.getBoundingClientRect().top + window.scrollY - scrollOffset
        window.scrollTo({ top, behavior: 'smooth' })
        return
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    scrollIntoView()
  }

  const handleShowMore = () => {
    setVisibleItems(prev => Math.min(prev + itemsPerPage, totalItems))
  }

  const handleCollapse = () => {
    setVisibleItems(itemsPerPage)
    scrollIntoView()
  }

  const hasMoreItems = visibleItems < totalItems
  const remainingItems = totalItems - visibleItems
  const isExpanded = visibleItems > itemsPerPage

  return {
    currentPage,
    totalPages,
    visibleItems,
    itemsPerPage,
    hasMoreItems,
    remainingItems,
    isExpanded,
    handlePageChange,
    handleShowMore,
    handleCollapse,
    isMobile,
  }
}
