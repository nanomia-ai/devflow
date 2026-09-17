---
summary: Defines Ops Board as a browser workspace where operations coordinators triage, prioritize, and assign queued service requests.
read_when:
  - Read when deciding Ops Board users, product boundary, shared language, or queue meaning.
---

# Product: Ops Board

Operations coordinators need one browser workspace to understand an active service-request queue,
focus urgent work, assign ownership, and see when a request is no longer waiting. Ops Board provides
that workspace; it does not execute the service work, define staffing policy, or replace the source
systems that submit requests.

`Request` is one submitted unit of service work. `Queue` is the ordered set of requests not yet
completed. `Assignment` is the current responsible operator. `Priority` is the business ordering
signal set by authorized coordinators.

The product shows the current queue, supports search and filtering, lets coordinators inspect a
request, change its priority, assign or reassign it, and mark it completed. The queue business rules
belong to [the Queue Domain](domains/queue/index.md). The browser workspace is a product capability,
so Design is required after Architecture declares the supported surface.

Open product questions: none.
