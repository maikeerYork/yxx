import VueRouter from "vue-router"
import store from '../store/index'
const router = new VueRouter({
    routes: [
        //配置路由的路径
        {
            path: '/',
            component: () => import('@/views/login/index'),
        },
        {
            path: '/booth',
            component: () => import('@/views/booth/index'),
        },
        {
            path: '/canteen',
            component: () => import('@/views/canteen/index'),
        },
        {
            path: '/layout',
            component: () => import('@/views/layout/index'),
            children: [
                // 名厨
                {
                    path: 'famousChef',
                    component: () => import('@/views/kitchenStove/famousChef/index'),
                },
                // 消费
                {
                    path: 'summary',
                    component: () => import('@/views/consumeControl/summary/index'),
                },
                {
                    path: 'consumptionAnalysis',
                    component: () => import('@/views/consumeControl/consumptionAnalysis/index'),
                }, {
                    path: 'orderStatistics',
                    component: () => import('@/views/consumeControl/orderStatistics/index'),
                }, {
                    path: 'cashierStatistics',
                    component: () => import('@/views/consumeControl/cashierStatistics/index'),
                }, {
                    path: 'visualSettlement',
                    component: () => import('@/views/consumeControl/visualSettlement/index'),
                }, {
                    path: 'consumptionStatistics',
                    component: () => import('@/views/consumeControl/consumptionStatistics/index'),
                },
                {
                    path: 'consumptionStatement',
                    component: () => import('@/views/consumeControl/consumptionStatement/index')
                },
                // 进销存
                {
                    path: 'breakdown',
                    component: () => import('@/views/drp/breakdown/index'),
                }, {
                    path: 'summarySheet',
                    component: () => import('@/views/drp/summarySheet/index'),
                }, {
                    path: 'inOutAnalysis',
                    component: () => import('@/views/drp/inOutAnalysis/index'),
                },
                {
                    path: 'orderPurchase',
                    component: () => import('@/views/drp/orderPurchase/index'),
                },
                {
                    path: 'purchaseDetails',
                    component: () => import('@/views/drp/purchaseDetails/index'),
                },
                {
                    path: 'warehousingDetails',
                    component: () => import('@/views/drp/warehousingDetails/index'),
                },
                {
                    path: 'deliveryDetails',
                    component: () => import('@/views/drp/deliveryDetails/index'),
                },
                {
                    path: 'inventoryInquiry',
                    component: () => import('@/views/drp/inventoryInquiry/index'),
                },
                // 微应用
                {
                    path: 'personalConsumption',
                    component: () => import('@/views/weak/personalConsumption/index'),
                },
                {
                    path: 'userAnalyse',
                    component: () => import('@/views/weak/userAnalyse/index'),
                },
                {
                    path: 'feedback',
                    component: () => import('@/views/weak/feedback/index')
                },
                {
                    path: 'cloudBuy',
                    component: () => import('@/views/weak/cloudBuy/index')
                }
            ]
        }
    ]
})
router.beforeEach(async (to, from, next) => {
    if (store.state.chimee.length) {
        console.log(store.state.chimee, 'store.state.chimee');
        store.state.chimee.forEach(item => {
            item.destroy()
        })
        store.state.chimee = []
    }
    next()
})
export default router;