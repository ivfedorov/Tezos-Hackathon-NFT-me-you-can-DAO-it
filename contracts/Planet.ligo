(* Define types *)
type token_id is nat
type account is
  record [
    balance         : nat;
    allowances      : set (address);
  ]

type token_metadata_info is
  record [
    token_id  : token_id;
    extras    : map (string, bytes);
  ]
  
const default_token_id : token_id = 0n;
(* contract storage *)
type storage is
  record [
    total_supply              : nat;
    ledger                    : big_map (address, account);
    token_metadata            : big_map (token_id, token_metadata_info);
    metadata                  : big_map(string, bytes);
  ]

type return is list (operation) * storage

type transfer_destination is
  [@layout:comb]
  record [
    to_       : address;
    token_id  : token_id;
    amount    : nat;
  ]

type transfer_param is
  [@layout:comb]
  record [
    from_   : address;
    txs     : list (transfer_destination);
  ]

type balance_of_request is
  [@layout:comb]
  record [
    owner       : address;
    token_id    : token_id;
  ]

type balance_of_response is
  [@layout:comb]
  record [
    request     : balance_of_request;
    balance     : nat;
  ]

type balance_params is
  [@layout:comb]
  record [
    requests    : list (balance_of_request);
    callback    : contract (list (balance_of_response));
  ]

type operator_param is
  [@layout:comb]
  record [
    owner     : address;
    operator  : address;
    token_id  : token_id;
  ]

type update_operator_param is
| Add_operator    of operator_param
| Remove_operator of operator_param

type transfer_params is list (transfer_param)
// type balance_params is michelson_pair_right_comb(balance_params_r)
type update_operator_params is list (update_operator_param)
type mint_params is list (transfer_destination)

type token_action is
| Transfer                of transfer_params
| Balance_of              of balance_params
| Update_operators        of update_operator_params
| Mint                    of mint_params

(* Helper function to get account *)
function get_account (const addr : address; const s : storage) : account is
  block {
    var acct : account :=
      record [
        balance    = 0n;
        allowances = (set [] : set (address));
      ];
    case s.ledger[addr] of
      None -> skip
    | Some(instance) -> acct := instance
    end;
  } with acct


(* Perform transfers from one owner *)
function iterate_transfer (const s : storage; const user_trx_params : transfer_param) : storage is
  block {
    (* Retrieve sender account from storage *)
    const sender_account : account = get_account(user_trx_params.from_, s);

    (* Check permissions *)
    if user_trx_params.from_ = Tezos.sender or sender_account.allowances contains Tezos.sender then
      skip
    else failwith("FA2_NOT_OPERATOR");

    (* Perform single transfer *)
    function make_transfer(const s : storage; const transfer : transfer_destination) : storage is
      block {
        (* Token id check *)
        if default_token_id =/= transfer.token_id then
          failwith("FA2_TOKEN_UNDEFINED")
        else skip;

        (* Balance check *)
        if sender_account.balance < transfer.amount then
          failwith("FA2_INSUFFICIENT_BALANCE")
        else skip;

        (* Update sender balance *)
        sender_account.balance := abs(sender_account.balance - transfer.amount);

        (* Update storage *)
        s.ledger[user_trx_params.from_] := sender_account;

        (* Create or get destination account *)
        var dest_account : account := get_account(transfer.to_, s);

        (* Update destination balance *)
        dest_account.balance := dest_account.balance + transfer.amount;

        (* Update storage *)
        s.ledger[transfer.to_] := dest_account;
    } with s;
} with (List.fold (make_transfer, user_trx_params.txs, s))


(* Perform mint of new tokens *)
function iterate_mint(const s : storage; const transfer : transfer_destination) : storage is
  block {
    (* check conditions / business logic *)

    (* Create or get destination account *)
    var dest_account : account := get_account(transfer.to_, s);

    (* Update destination balance *)
    dest_account.balance := dest_account.balance + transfer.amount;

    (* Update storage *)
    s.ledger[transfer.to_] := dest_account;
} with s;

(* Perform single operator update *)
function iterate_update_operator (const s : storage; const params : update_operator_param) : storage is
  block {
    case params of
    | Add_operator(param) -> {
      (* Token id check *)
      if default_token_id =/= param.token_id then
        failwith("FA2_TOKEN_UNDEFINED")
      else skip;
      
      (* Check an owner *)
      if Tezos.sender =/= param.owner then
        failwith("FA2_NOT_OWNER")
      else skip;

      (* Create or get sender account *)
      var sender_account : account := get_account(param.owner, s);

      (* Set operator *)
      sender_account.allowances := Set.add(param.operator, sender_account.allowances);

      (* Update storage *)
      s.ledger[param.owner] := sender_account;
    }
    | Remove_operator(param) -> {
      (* Token id check *)
      if default_token_id =/= param.token_id then
        failwith("FA2_TOKEN_UNDEFINED")
      else skip;
      
      (* Check an owner *)
      if Tezos.sender =/= param.owner then
        failwith("FA2_NOT_OWNER")
      else skip;

      (* Create or get sender account *)
      var sender_account : account := get_account(param.owner, s);

      (* Set operator *)
      sender_account.allowances := Set.remove(param.operator, sender_account.allowances);

      (* Update storage *)
      s.ledger[param.owner] := sender_account;
    }
    end
  } with s

(* Perform balance look up *)
function get_balance_of (const balance_params : balance_params; const s : storage) : list(operation) is
  block {

    (* Perform single balance lookup *)
    function look_up_balance(const l: list (balance_of_response); const request : balance_of_request) : list (balance_of_response) is
      block {
        (* Token id check *)
        if default_token_id =/= request.token_id then
          failwith("FA2_TOKEN_UNDEFINED")
        else skip;

        (* Retrieve the asked account balance from storage *)
        const sender_account : account = get_account(request.owner, s);

        (* Form the response *)
        const response : balance_of_response = record [
          request   = request;
          balance   = sender_account.balance;
        ];
      } with response # l;
    
    (* Collect balances info *)
    const accomulated_response : list (balance_of_response) = List.fold(look_up_balance, balance_params.requests, (nil: list(balance_of_response)));
  } with list [transaction(accomulated_response, 0tz, balance_params.callback)]

(* TokenFA2 - Mock FA2 token for tests *)
function main (const action : token_action; var s : storage) : return is
  block {
    skip
  } with case action of
    | Transfer(params)                  -> ((nil : list (operation)), List.fold(iterate_transfer, params, s))
    | Balance_of(params)                -> (get_balance_of(params, s), s)
    | Update_operators(params)          -> ((nil : list (operation)), List.fold(iterate_update_operator, params, s))
    | Mint(params)                      -> ((nil : list (operation)), List.fold(iterate_mint, params, s))
  end;
  
