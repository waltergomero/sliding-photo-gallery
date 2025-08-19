'use client'

import { LineChart, PieChart } from 'echarts/charts'
import { TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import dynamic from 'next/dynamic'
import { useId } from 'react'
import { useIsClient } from 'usehooks-ts'

import { getEchartOptions, getOrdersStatsOptions, getWorldMapOptions } from '../data'

const EChartClient = dynamic(() => import('@/components/client-wrapper/EChartClient'), { ssr: false })
const BaseVectorMap = dynamic(() => import('@/components/maps/BaseVectorMap'), { ssr: false })

export const DonutChart = () => {
  return <EChartClient extensions={[PieChart, TooltipComponent, CanvasRenderer]} getOptions={getEchartOptions} style={{ height: 60, width: 60 }} />
}

export const OrdersChart = () => {
  return <EChartClient extensions={[LineChart, TooltipComponent, CanvasRenderer]} getOptions={getOrdersStatsOptions} style={{ height: 405 }} />
}

export const WorldMap = () => {
  const id = useId()
  const isClient = useIsClient()
  return isClient && <BaseVectorMap id={id} options={getWorldMapOptions()} style={{ height: 297 }} />
}
