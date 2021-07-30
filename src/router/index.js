import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import InvoiceView from "../views/InvoiceView.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      title: "Home - Invoicy",
      metaTags: [
        {
          name: "description",
          content: "Keep record of your invoices.",
        },
        {
          property: "og:description",
          content: "Keep record of your invoices.",
        },
      ],
    },
  },
  {
    path: "/invoice/:invoiceId",
    name: "Invoice",
    component: InvoiceView,
    meta: {
      title: "Invoicy",
      metaTags: [
        {
          name: "description",
          content: "Keep record of your invoices.",
        },
        {
          property: "og:description",
          content: "Keep record of your invoices.",
        },
      ],
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  /* The routing changes and modify the page title */
  if (to.meta.title) {
    if (to.params.invoiceId) {
      document.title = `Invoicy - ${to.params.invoiceId}`;
    } else {
      document.title = to.meta.title;
    }
  }
  next();
});

export default router;
