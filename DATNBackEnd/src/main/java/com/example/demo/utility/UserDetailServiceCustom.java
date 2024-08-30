package com.example.demo.utility;

<<<<<<< HEAD
import org.springframework.beans.factory.annotation.Autowired;
=======
import com.example.demo.entity.Account;
import com.example.demo.repository.AccountsRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
>>>>>>> 20be25b1403d69c969009ba98fdc54c3d8736ec4
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

<<<<<<< HEAD
import java.util.Collections;
=======
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
>>>>>>> 20be25b1403d69c969009ba98fdc54c3d8736ec4

@Service
public class UserDetailServiceCustom implements UserDetailsService {
    @Autowired
    AccountsRepo accountsRepo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Account account = accountsRepo.findByUsername(username);
        User userAutho = new User(
                account.getUsername(),
                account.getPassword(),
                Collections.singleton(new SimpleGrantedAuthority("ROLE_" + account.getRole().getName().toUpperCase()))
        );
        return userAutho;
    }
}
