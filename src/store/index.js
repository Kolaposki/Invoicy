import { createStore } from "vuex";
import db from "../firebase/firebaseInit";
export default createStore({
  state: {
    invoiceData: [],
    invoiceModal: null,
    isModalActive: null,
    invoicesLoaded: null,
    currentInvoiceArray: null, // single object used in detailed page
    editInvoice: null,
  },
  mutations: {
    TOGGLE_INVOICE(state) {
      state.invoiceModal = !state.invoiceModal;
    },
    TOGGLE_MODAL(state) {
      state.isModalActive = !state.isModalActive;
    },
    SET_INVOICE_DATA(state, payload) {
      // console.log("payload", payload);
      state.invoiceData.push(payload);
    },
    INVOICES_LOADED(state) {
      state.invoicesLoaded = true;
    },
    SET_CURRENT_INVOICE(state, payload) {
      state.currentInvoiceArray = state.invoiceData.filter((invoice) => {
        return invoice.invoiceId === payload;
      });
    },
    TOGGLE_EDIT_INVOICE(state) {
      state.editInvoice = !state.editInvoice;
    },
    DELETE_INVOICE(state, payload) {
      // only deletes from the frontend
      state.invoiceData = state.invoiceData.filter((invoice) => {
        return invoice.docId !== payload; // pop out that id in invoiceData
      });
    },
    UPDATE_STATUS_TO_PAID(state, payload) {
      state.invoiceData.forEach((invoice) => {
        if (invoice.docId === payload) {
          invoice.invoicePaid = true;
          invoice.invoicePending = false;
        }
      });
    },
    UPDATE_STATUS_TO_PENDING(state, payload) {
      state.invoiceData.forEach((invoice) => {
        if (invoice.docId === payload) {
          invoice.invoicePaid = false;
          invoice.invoicePending = true;
          invoice.invoiceDraft = false;
        }
      });
    },
  },
  actions: {
    async GET_INVOICES({ commit, state }) {
      const getData = db.collection("invoices"); // get collection from firestore
      const results = await getData.get(); //get results as document
      results.forEach((doc) => {
        if (!state.invoiceData.some((invoice) => invoice.docId === doc.id)) {
          // some() so to only query new data in real time
          const data = {
            docId: doc.id,
            invoiceId: doc.data().invoiceId,
            billerStreetAddress: doc.data().billerStreetAddress,
            billerCity: doc.data().billerCity,
            billerZipCode: doc.data().billerZipCode,
            billerCountry: doc.data().billerCountry,
            clientName: doc.data().clientName,
            clientEmail: doc.data().clientEmail,
            clientStreetAddress: doc.data().clientStreetAddress,
            clientCity: doc.data().clientCity,
            clientZipCode: doc.data().clientZipCode,
            clientCountry: doc.data().clientCountry,
            invoiceDateUnix: doc.data().invoiceDateUnix,
            invoiceDate: doc.data().invoiceDate,
            paymentTerms: doc.data().paymentTerms,
            paymentDueDateUnix: doc.data().paymentDueDateUnix,
            paymentDueDate: doc.data().paymentDueDate,
            productDescription: doc.data().productDescription,
            invoiceItemList: doc.data().invoiceItemList,
            invoiceTotal: doc.data().invoiceTotal,
            invoicePending: doc.data().invoicePending,
            invoiceDraft: doc.data().invoiceDraft,
            invoicePaid: doc.data().invoicePaid,
          };
          commit("SET_INVOICE_DATA", data);
        }
      });
      commit("INVOICES_LOADED");
    },
    async UPDATE_INVOICE({ commit, dispatch }, { docId, routeId }) {
      // routeId is same as invoiceId

      commit("DELETE_INVOICE", docId);
      await dispatch("GET_INVOICES");
      commit("TOGGLE_EDIT_INVOICE");
      commit("SET_CURRENT_INVOICE", routeId);
    },
    async DELETE_INVOICE({ commit }, docId) {
      const getInvoice = db.collection("invoices").doc(docId);
      await getInvoice.delete(); // actually delete from firebase
      commit("DELETE_INVOICE", docId); // delete from the frontend
    },
    async UPDATE_STATUS_TO_PAID({ commit }, docId) {
      const getInvoice = db.collection("invoices").doc(docId);
      await getInvoice.update({
        // update in firebase
        invoicePaid: true,
        invoicePending: false,
      });
      commit("UPDATE_STATUS_TO_PAID", docId); // update state in frontend
    },
    async UPDATE_STATUS_TO_PENDING({ commit }, docId) {
      const getInvoice = db.collection("invoices").doc(docId);
      await getInvoice.update({
        // update in firebase
        invoicePaid: false,
        invoiceDraft: false,
        invoicePending: true,
      });
      commit("UPDATE_STATUS_TO_PENDING", docId); // update state in frontend
    },
  },
  modules: {},
});
