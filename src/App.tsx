import React from "react";
import axios from "axios";
import val from "./models/val";
import { Box, Button, Container, Grid, Divider } from "@material-ui/core";
import Table from "./components/Table";
import _ from "lodash";
import Skeleton from "@material-ui/lab/Skeleton";
function App() {
  const [data, setData] = React.useState<val[]>();
  const [display, setDisplay] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const DisplayTable = () => {
    GetData();

    setDisplay(true);
  };

  const GetData = () => {
    axios
      .get("http://localhost:3000/values")
      .then((res) => {
        setData(res.data.result);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const DeleteData = () => {
    axios
      .delete("http://localhost:3000/delete")
      .then((res) => GetData())
      .catch((err) => {
        console.log(err);
      });
  };

  const PostData = () => {
    let arr: any[] = [];
    for (let i = 0; i < 10; i++) {
      let data = _.random(10, 99);
      arr.push({
        num: data,
      });
    }
    const res = {
      val: arr,
    };
    axios
      .post("http://localhost:3000/values", res)
      .then((res) => {
        setDisplay(false);
        setLoading(true);
        setTimeout(function () {
          setLoading(false);
          GetData();
          setDisplay(true);
        }, 3000);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <Container maxWidth="md">
      <Box p={10}>
        <Grid container spacing={5}>
          <Grid item xs={5}>
            <Grid container spacing={5}>
              <Grid item xs={4}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => PostData()}
                >
                  Save
                </Button>
              </Grid>
              <Grid item xs={4}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => DeleteData()}
                >
                  Delete
                </Button>
              </Grid>
              <Grid item xs={4}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => DisplayTable()}
                >
                  Show
                </Button>
              </Grid>
            </Grid>
            <Box mt={5}>
              {display ? (
                <Table {...data} />
              ) : loading ? (
                <>
                  <Skeleton />
                  <Skeleton animation={false} />
                  <Skeleton animation="wave" />
                </>
              ) : undefined}
            </Box>
          </Grid>
          <Divider orientation="vertical" flexItem />
          <Grid item xs={5}>
            <Grid container spacing={5}>
              <Grid item xs={6}>
                <Button variant="contained" color="secondary">
                  2.1
                </Button>
              </Grid>

              <Grid item xs={6}>
                <Button variant="contained" color="secondary">
                  2.2
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default App;
