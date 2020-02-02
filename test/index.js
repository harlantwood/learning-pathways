/// NB: The tryorama config patterns are still not quite stabilized.
/// See the tryorama README [https://github.com/holochain/tryorama]
/// for a potentially more accurate example


const path = require("path");

const {
  Orchestrator,
  Config,
  combine,
  singleConductor,
  localOnly,
  tapeExecutor
} = require("@holochain/tryorama");

process.on("unhandledRejection", error => {
  console.error("got unhandledRejection:", error);
  process.exit(1)
});

const dnaPath = path.join(__dirname, "../dist/learning-pathways.dna.json");

const orchestrator = new Orchestrator({
  middleware: combine(
    tapeExecutor(require("tape")),
    localOnly
  )
});

const dna = Config.dna(dnaPath, "course_dna");
const conductorConfig = Config.gen(
  { course_dna: dna },
  {
    network: {
      type: "sim2h",
      sim2h_url: "ws://localhost:9000"
    }
  }
);


// orchestrator.registerScenario("Scenario1: Zome is working", async (s, t) => {
//   const { alice, bob } = await s.players(
//     { alice: conductorConfig, bob: conductorConfig },
//     true
//   );

//   const result_hello = await alice.call("course_dna", "courses", "hi_holo", {
//     title: "hello holochain"
//   })

//   t.equal(result_hello.Ok, "hello holochain");

//   await s.consistency();

// });


orchestrator.registerScenario("Scenario2: Create new course", async (scenario, t) => {
  const { alice, bob } = await scenario.players(
    { alice: conductorConfig, bob: conductorConfig },
    true
  );

  const title = "first course for scenario 2";

  const create_course_response = await alice.call("course_dna", "courses", "create_course", {
    title: title,
    timestamp: 1
  })

  const new_course_addr = create_course_response.Ok;
  t.ok(new_course_addr);

  await scenario.consistency();

  const get_entry_response = await alice.call("course_dna", "courses", "get_entry", {
    address: new_course_addr
  })

  t.ok(get_entry_response.Ok);
  t.ok(get_entry_response.Ok.App);
  t.ok(get_entry_response.Ok.App[1]);

  retrieved_course = JSON.parse(get_entry_response.Ok.App[1]);
  alice_address = alice.instance("course_dna").agentAddress;

  t.equal(retrieved_course.title, title);
  t.equal(retrieved_course.timestamp, 1);
  t.equal(retrieved_course.teacher_address, alice_address);

  t.deepEqual(retrieved_course, {
    modules: [],
    teacher_address: alice_address,
    timestamp: 1,
    title: 'first course for scenario 2',
  });

  await scenario.consistency();

});


// orchestrator.registerScenario("Scenario3: Delete course", async (s, t) => {
//   const { alice, bob } = await s.players(
//     { alice: conductorConfig, bob: conductorConfig },
//     true
//   );

//   const new_course_addr = await alice.call("course_dna", "courses", "create_course", {
//     title: "first course for scneario 3",
//     timestamp: 1
//   })

//   t.ok(new_course_addr.Ok);
//   await s.consistency();

//   const deleted_course_addr = await alice.call("course_dna", "courses", "delete_course", {
//     course_address: new_course_addr.Ok
//   });

//   console.log("_this_is_me"); // just a trick to find the log in big out of debug test screen.
//   console.log(deleted_course_addr);
//   t.ok(deleted_course_addr.Ok);


//   // TODO:Homework, get_entry and Assert that your retrived object is the samme as Created Object

//   await s.consistency();

// });


// orchestrator.registerScenario("Scenario4: Update course title", async (s, t) => {
//   const { alice, bob } = await s.players(
//     { alice: conductorConfig, bob: conductorConfig },
//     true
//   );
//   const course_addr = await alice.call(
//     "course_dna",
//     "courses",
//     "create_course",
//     {
//       title: "new course test for update test"
//       , timestamp: 123
//     }
//   );

//   const course_update_addrss = await alice.call(
//     "course_dna",
//     "courses",
//     "update_course",
//     {
//       title: "course title updated",
//       course_address: course_addr.Ok,
//       modules_addresses: [],
//       timestamp: 123

//     }
//   );



//   const courseResult = await alice.call("course_dna", "courses", "get_entry", {
//     address: course_update_addrss.Ok
//   });


//   const course = JSON.parse(courseResult.Ok.App[1]);
//   console.log(course);
//   t.deepEqual(course, {
//     title: "course title updated",
//     timestamp: 123,
//     teacher_address: alice.instance("course_dna").agentAddress,
//     modules: []
//   });



// });

orchestrator.run();
