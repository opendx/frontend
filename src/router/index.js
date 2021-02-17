import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
import componentsRouter from './modules/components'
import chartsRouter from './modules/charts'
import tableRouter from './modules/table'
import nestedRouter from './modules/nested'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/pages/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '仪表板', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: 'log',
    component: Layout,
    children: [
      {
        path: '/:wsUrl',
        component: () => import('@/pages/log/index'),
        name: 'Log',
        meta: { title: '日志', noCache: false },
        hidden: true
      }
    ]
  }
  // {
  //   path: '/documentation',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/documentation/index'),
  //       name: 'Documentation',
  //       meta: { title: 'Documentation', icon: 'documentation', affix: true }
  //     }
  //   ]
  // },
  // {
  //   path: '/guide',
  //   component: Layout,
  //   redirect: '/guide/index',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/guide/index'),
  //       name: 'Guide',
  //       meta: { title: 'Guide', icon: 'guide', noCache: true }
  //     }
  //   ]
  // },
  // {
  //   path: '/profile',
  //   component: Layout,
  //   redirect: '/profile/index',
  //   hidden: true,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/profile/index'),
  //       name: 'Profile',
  //       meta: { title: 'Profile', icon: 'user', noCache: true }
  //     }
  //   ]
  // },

]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/browser',
    component: Layout,
    meta: { icon: 'browser', roles: ['browser'] },
    children: [
      {
        path: 'list',
        component: () => import('@/pages/browser/list'),
        name: 'BrowserList',
        meta: { title: '浏览器', noCache: true }
      }
    ]
  },
  {
    path: '/mobile',
    component: Layout,
    meta: { icon: 'mobile', roles: ['mobile'] },
    children: [
      {
        path: 'list',
        component: () => import('@/pages/mobile/list'),
        name: 'MobileList',
        meta: { title: 'Mobile', noCache: true }
      }
    ]
  },
  {
    path: '/app',
    component: Layout,
    meta: { icon: 'app', roles: ['app'] },
    children: [
      {
        path: 'add',
        component: () => import('@/pages/app/add'),
        name: 'AddApp',
        meta: { title: '添加App', noCache: false },
        hidden: true
      },
      {
        path: 'update/:appId',
        component: () => import('@/pages/app/update'),
        name: 'UpdateApp',
        meta: { title: '更新app', noCache: false },
        hidden: true
      },
      {
        path: 'list',
        component: () => import('@/pages/app/list'),
        name: 'AppList',
        meta: { title: 'App', noCache: true }
      }
    ]
  },
  {
    path: '/driver',
    component: Layout,
    meta: { icon: 'chrome', roles: ['driver'] },
    children: [
      {
        path: 'add',
        component: () => import('@/pages/driver/add'),
        name: 'AddDriver',
        meta: { title: '添加Driver', noCache: false },
        hidden: true
      },
      {
        path: 'update/:driverId',
        component: () => import('@/pages/driver/update'),
        name: 'UpdateDriver',
        meta: { title: '更新Driver', noCache: false },
        hidden: true
      },
      {
        path: 'list',
        component: () => import('@/pages/driver/list'),
        name: 'DriverList',
        meta: { title: 'Driver', noCache: true }
      }
    ]
  },
  {
    path: '/environment',
    component: Layout,
    meta: { icon: 'environment', roles: ['environment'] },
    children: [
      {
        path: 'add',
        component: () => import('@/pages/environment/add'),
        name: 'AddEnvironment',
        meta: { title: '添加环境', noCache: false },
        hidden: true
      },
      {
        path: 'update/:environmentId',
        component: () => import('@/pages/environment/update'),
        name: 'UpdateEnvironment',
        meta: { title: '更新环境', noCache: false },
        hidden: true
      },
      {
        path: 'list',
        component: () => import('@/pages/environment/list'),
        name: 'EnvironmentList',
        meta: { title: '环境', noCache: true }
      }
    ]
  },
  {
    path: '/globalVar',
    component: Layout,
    meta: { icon: 'globalvar', roles: ['globalVar'] },
    children: [
      {
        path: 'add',
        component: () => import('@/pages/globalvar/add'),
        name: 'AddGlobalVar',
        meta: { title: '添加全局变量', noCache: false },
        hidden: true
      },
      {
        path: 'update/:globalVarId',
        component: () => import('@/pages/globalvar/update'),
        name: 'UpdateGlobalVar',
        meta: { title: '更新全局变量', noCache: false },
        hidden: true
      },
      {
        path: 'list',
        component: () => import('@/pages/globalvar/list'),
        name: 'GlobalVarList',
        meta: { title: '全局变量', noCache: true }
      }
    ]
  },
  {
    path: '/page',
    component: Layout,
    meta: { icon: 'page', roles: ['page'] },
    children: [
      {
        path: 'add',
        component: () => import('@/pages/page/add'),
        name: 'AddPage',
        meta: { title: '添加Page', noCache: false },
        hidden: true
      },
      {
        path: 'update/:pageId',
        component: () => import('@/pages/page/update'),
        name: 'UpdatePage',
        meta: { title: '更新Page', noCache: false },
        hidden: true
      },
      {
        path: 'list',
        component: () => import('@/pages/page/list'),
        name: 'PageList',
        meta: { title: 'Page', noCache: true }
      }
    ]
  },
  {
    path: '/action/encapsulation',
    component: Layout,
    meta: { icon: 'module', roles: ['action'] },
    children: [
      {
        path: 'add',
        component: () => import('@/pages/action/encapsulation/add'),
        name: 'AddEncapsulationAction',
        meta: { title: '添加Action', noCache: false },
        hidden: true
      },
      {
        path: 'update/:actionId',
        component: () => import('@/pages/action/encapsulation/update'),
        name: 'UpdateEncapsulationAction',
        meta: { title: '更新Action', noCache: false },
        hidden: true
      },
      {
        path: 'list',
        component: () => import('@/pages/action/encapsulation/list'),
        name: 'EncapsulationActionList',
        meta: { title: 'Action', noCache: true }
      }
    ]
  },
  {
    path: '/action/testcase',
    component: Layout,
    meta: { icon: 'testcase', roles: ['testcase'] },
    children: [
      {
        path: 'add',
        component: () => import('@/pages/action/testcase/add'),
        name: 'AddTestcaseAction',
        meta: { title: '添加测试用例', noCache: false },
        hidden: true
      },
      {
        path: 'update/:actionId',
        component: () => import('@/pages/action/testcase/update'),
        name: 'UpdateTestcaseAction',
        meta: { title: '更新测试用例', noCache: false },
        hidden: true
      },
      {
        path: 'list',
        component: () => import('@/pages/action/testcase/list'),
        name: 'TestcaseActionList',
        meta: { title: '测试用例', noCache: true }
      }
    ]
  },
  {
    path: '/testSuite',
    component: Layout,
    meta: { icon: 'testsuite', roles: ['testSuite'] },
    children: [
      {
        path: 'add',
        component: () => import('@/pages/testsuite/add'),
        name: 'AddTestSuite',
        meta: { title: '添加测试集', noCache: false },
        hidden: true
      },
      {
        path: 'update/:testSuiteId',
        component: () => import('@/pages/testsuite/update'),
        name: 'UpdateTestSuite',
        meta: { title: '更新测试集', noCache: false },
        hidden: true
      },
      {
        path: 'list',
        component: () => import('@/pages/testsuite/list'),
        name: 'TestSuiteList',
        meta: { title: '测试集', noCache: true }
      }
    ]
  },
  {
    path: '/testPlan',
    component: Layout,
    meta: { icon: 'testplan', roles: ['testPlan'] },
    children: [
      {
        path: 'add',
        component: () => import('@/pages/testplan/add'),
        name: 'AddTestPlan',
        meta: { title: '添加测试计划', noCache: false },
        hidden: true
      },
      {
        path: 'update/:testPlanId',
        component: () => import('@/pages/testplan/update'),
        name: 'UpdateTestPlan',
        meta: { title: '更新测试计划', noCache: false },
        hidden: true
      },
      {
        path: 'list',
        component: () => import('@/pages/testplan/list'),
        name: 'TestPlanList',
        meta: { title: '测试计划', noCache: true }
      }
    ]
  },
  {
    path: '/testTask',
    component: Layout,
    meta: { icon: 'testtask', roles: ['testTask'] },
    children: [
      {
        path: 'list',
        component: () => import('@/pages/testtask/list'),
        name: 'TestTaskList',
        meta: { title: '测试任务', noCache: true }
      },
      {
        path: 'report/:testTaskId',
        component: () => import('@/pages/testtask/report/index'),
        name: 'TestTaskReport',
        meta: { title: '测试报告', noCache: false },
        hidden: true
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    meta: { title: '系统管理', icon: 'setting', roles: ['admin'] },
    children: [
      {
        path: 'agent/list',
        component: () => import('@/pages/agent/list'),
        name: 'AgentList',
        meta: { title: 'Agent', icon: 'node', noCache: true }
      },
      {
        path: 'agent/extJar/list',
        component: () => import('@/pages/agent/extjar/list'),
        name: 'AgentExtJarList',
        meta: { title: 'AgentJar', icon: 'jar', noCache: false }
      },
      {
        path: 'user/add',
        component: () => import('@/pages/user/add'),
        name: 'AddUser',
        meta: { title: '添加用户', noCache: false },
        hidden: true
      },
      {
        path: 'user/update/:userId',
        component: () => import('@/pages/user/update'),
        name: 'UpdateUser',
        meta: { title: '更新用户', noCache: false },
        hidden: true
      },
      {
        path: 'user/list',
        component: () => import('@/pages/user/list'),
        name: 'UserList',
        meta: { title: '用户', icon: 'user', noCache: true }
      },
      {
        path: 'project/add',
        component: () => import('@/pages/project/add'),
        name: 'AddProject',
        meta: { title: '添加项目', noCache: false },
        hidden: true
      },
      {
        path: 'project/update/:projectId',
        component: () => import('@/pages/project/update'),
        name: 'UpdateProject',
        meta: { title: '更新项目', noCache: false },
        hidden: true
      },
      {
        path: 'project/list',
        component: () => import('@/pages/project/list'),
        name: 'ProjectList',
        meta: { title: '项目', icon: 'project', noCache: true }
      }
    ]
  },
  // {
  //   path: '/permission',
  //   component: Layout,
  //   redirect: '/permission/page',
  //   alwaysShow: true, // will always show the root menu
  //   name: 'Permission',
  //   meta: {
  //     title: 'Permission',
  //     icon: 'lock',
  //     roles: ['admin', 'editor'] // you can set roles in root nav
  //   },
  //   children: [
  //     {
  //       path: 'page',
  //       component: () => import('@/views/permission/page'),
  //       name: 'PagePermission',
  //       meta: {
  //         title: 'Page Permission',
  //         roles: ['admin'] // or you can only set roles in sub nav
  //       }
  //     },
  //     {
  //       path: 'directive',
  //       component: () => import('@/views/permission/directive'),
  //       name: 'DirectivePermission',
  //       meta: {
  //         title: 'Directive Permission'
  //         // if do not set roles, means: this page does not require permission
  //       }
  //     },
  //     {
  //       path: 'role',
  //       component: () => import('@/views/permission/role'),
  //       name: 'RolePermission',
  //       meta: {
  //         title: 'Role Permission',
  //         roles: ['admin']
  //       }
  //     }
  //   ]
  // },
  //
  // {
  //   path: '/icon',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/icons/index'),
  //       name: 'Icons',
  //       meta: { title: 'Icons', icon: 'icon', noCache: true }
  //     }
  //   ]
  // },
  //
  // /** when your routing map is too long, you can split it into small modules **/
  // componentsRouter,
  // chartsRouter,
  // nestedRouter,
  // tableRouter,
  //
  // {
  //   path: '/example',
  //   component: Layout,
  //   redirect: '/example/list',
  //   name: 'Example',
  //   meta: {
  //     title: 'Example',
  //     icon: 'example'
  //   },
  //   children: [
  //     {
  //       path: 'create',
  //       component: () => import('@/views/example/create'),
  //       name: 'CreateArticle',
  //       meta: { title: 'Create Article', icon: 'edit' }
  //     },
  //     {
  //       path: 'edit/:id(\\d+)',
  //       component: () => import('@/views/example/edit'),
  //       name: 'EditArticle',
  //       meta: { title: 'Edit Article', noCache: true, activeMenu: '/example/list' },
  //       hidden: true
  //     },
  //     {
  //       path: 'list',
  //       component: () => import('@/views/example/list'),
  //       name: 'ArticleList',
  //       meta: { title: 'Article List', icon: 'list' }
  //     }
  //   ]
  // },
  //
  // {
  //   path: '/tab',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/tab/index'),
  //       name: 'Tab',
  //       meta: { title: 'Tab', icon: 'tab' }
  //     }
  //   ]
  // },
  //
  // {
  //   path: '/error',
  //   component: Layout,
  //   redirect: 'noRedirect',
  //   name: 'ErrorPages',
  //   meta: {
  //     title: 'Error Pages',
  //     icon: '404'
  //   },
  //   children: [
  //     {
  //       path: '401',
  //       component: () => import('@/views/error-page/401'),
  //       name: 'Page401',
  //       meta: { title: '401', noCache: true }
  //     },
  //     {
  //       path: '404',
  //       component: () => import('@/views/error-page/404'),
  //       name: 'Page404',
  //       meta: { title: '404', noCache: true }
  //     }
  //   ]
  // },
  //
  // {
  //   path: '/error-log',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'log',
  //       component: () => import('@/views/error-log/index'),
  //       name: 'ErrorLog',
  //       meta: { title: 'Error Log', icon: 'bug' }
  //     }
  //   ]
  // },
  //
  // {
  //   path: '/excel',
  //   component: Layout,
  //   redirect: '/excel/export-excel',
  //   name: 'Excel',
  //   meta: {
  //     title: 'Excel',
  //     icon: 'excel'
  //   },
  //   children: [
  //     {
  //       path: 'export-excel',
  //       component: () => import('@/views/excel/export-excel'),
  //       name: 'ExportExcel',
  //       meta: { title: 'Export Excel' }
  //     },
  //     {
  //       path: 'export-selected-excel',
  //       component: () => import('@/views/excel/select-excel'),
  //       name: 'SelectExcel',
  //       meta: { title: 'Export Selected' }
  //     },
  //     {
  //       path: 'export-merge-header',
  //       component: () => import('@/views/excel/merge-header'),
  //       name: 'MergeHeader',
  //       meta: { title: 'Merge Header' }
  //     },
  //     {
  //       path: 'upload-excel',
  //       component: () => import('@/views/excel/upload-excel'),
  //       name: 'UploadExcel',
  //       meta: { title: 'Upload Excel' }
  //     }
  //   ]
  // },
  //
  // {
  //   path: '/zip',
  //   component: Layout,
  //   redirect: '/zip/download',
  //   alwaysShow: true,
  //   name: 'Zip',
  //   meta: { title: 'Zip', icon: 'zip' },
  //   children: [
  //     {
  //       path: 'download',
  //       component: () => import('@/views/zip/index'),
  //       name: 'ExportZip',
  //       meta: { title: 'Export Zip' }
  //     }
  //   ]
  // },
  //
  // {
  //   path: '/pdf',
  //   component: Layout,
  //   redirect: '/pdf/index',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/pdf/index'),
  //       name: 'PDF',
  //       meta: { title: 'PDF', icon: 'pdf' }
  //     }
  //   ]
  // },
  // {
  //   path: '/pdf/download',
  //   component: () => import('@/views/pdf/download'),
  //   hidden: true
  // },
  //
  // {
  //   path: '/theme',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/theme/index'),
  //       name: 'Theme',
  //       meta: { title: 'Theme', icon: 'theme' }
  //     }
  //   ]
  // },
  //
  // {
  //   path: '/clipboard',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/clipboard/index'),
  //       name: 'ClipboardDemo',
  //       meta: { title: 'Clipboard', icon: 'clipboard' }
  //     }
  //   ]
  // },
  //
  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://github.com/PanJiaChen/vue-element-admin',
  //       meta: { title: 'External Link', icon: 'link' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
