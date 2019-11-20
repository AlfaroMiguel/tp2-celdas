import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

export default class SendDialog extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      amount: 0
    };
  }

  handleModifyAmount = event => {
    this.setState({
      amount: event.target.value
    });
  };

  handleClose = () => {
    this.props.onClose(this.state.amount);
  };

  render = () => {
    const { sendModalOpen, classes } = this.props;

    return (
      <Dialog
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={sendModalOpen}
        onClose={this.handleClose}
      >
        <DialogTitle id="alert-dialog-title">Support Project</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            How much Gas do you want to send to this project?
          </DialogContentText>
          <TextField
            autoFocus
            id="amount"
            name="amount"
            onChange={this.handleModifyAmount}
            className={classes.textField}
            label="Amount"
            margin="normal"
            type="number"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={this.handleClose} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
}
